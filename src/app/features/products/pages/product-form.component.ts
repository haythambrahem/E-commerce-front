import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../../categories/services/category.service';
import { Product, Category } from '../../../core/models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="product-form-container">
      <header class="page-header">
        <h1>{{ isEditMode ? 'Edit Product' : 'New Product' }}</h1>
        <a routerLink="/products" class="btn btn-secondary">Back to List</a>
      </header>

      @if (loading) {
        <div class="loading">Loading...</div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (!loading) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="product-form">
          <div class="form-group">
            <label for="name">Name *</label>
            <input 
              id="name" 
              type="text" 
              formControlName="name"
              [class.invalid]="form.get('name')?.invalid && form.get('name')?.touched">
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
              <span class="error">Name is required</span>
            }
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              formControlName="description"
              rows="4">
            </textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Price *</label>
              <input 
                id="price" 
                type="number" 
                step="0.01"
                formControlName="price"
                [class.invalid]="form.get('price')?.invalid && form.get('price')?.touched">
              @if (form.get('price')?.invalid && form.get('price')?.touched) {
                <span class="error">Valid price is required</span>
              }
            </div>

            <div class="form-group">
              <label for="stock">Stock *</label>
              <input 
                id="stock" 
                type="number" 
                formControlName="stock"
                [class.invalid]="form.get('stock')?.invalid && form.get('stock')?.touched">
              @if (form.get('stock')?.invalid && form.get('stock')?.touched) {
                <span class="error">Valid stock is required</span>
              }
            </div>
          </div>

          <div class="form-group">
            <label for="categoryId">Category</label>
            <select id="categoryId" formControlName="categoryId">
              <option [ngValue]="null">Select a category</option>
              @for (category of categories; track category.id) {
                <option [ngValue]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" [disabled]="form.invalid || submitting" class="btn btn-primary">
              {{ submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
            <a routerLink="/products" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .product-form-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .product-form {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 24px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
    }
    .form-group input.invalid,
    .form-group textarea.invalid {
      border-color: #d32f2f;
    }
    .form-group .error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      font-size: 14px;
    }
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .loading, .error-message {
      text-align: center;
      padding: 20px;
    }
    .error-message {
      color: #d32f2f;
      background: #ffebee;
      border-radius: 4px;
      margin-bottom: 16px;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct(this.productId);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null]
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories:', err.message);
      }
    });
  }

  private loadProduct(id: number): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    const product: Product = this.form.value;

    const operation = this.isEditMode && this.productId
      ? this.productService.update(this.productId, product)
      : this.productService.create(product);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.submitting = false;
      }
    });
  }
}
