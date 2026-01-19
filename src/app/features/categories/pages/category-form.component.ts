import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="category-form-container">
      <header class="page-header">
        <h1>{{ isEditMode ? 'Edit Category' : 'New Category' }}</h1>
        <a routerLink="/categories" class="btn btn-secondary">Back to List</a>
      </header>

      @if (loading) {
        <div class="loading">Loading...</div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (!loading) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="category-form">
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

          <div class="form-actions">
            <button type="submit" [disabled]="form.invalid || submitting" class="btn btn-primary">
              {{ submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
            <a routerLink="/categories" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .category-form-container {
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
    .category-form {
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
    .form-group textarea {
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
export class CategoryFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  loading = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = Number(id);
      this.loadCategory(this.categoryId);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  private loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getById(id).subscribe({
      next: (category) => {
        this.form.patchValue({
          name: category.name,
          description: category.description
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

    const category: Category = this.form.value;

    const operation = this.isEditMode && this.categoryId
      ? this.categoryService.update(this.categoryId, category)
      : this.categoryService.create(category);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/categories']);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.submitting = false;
      }
    });
  }
}
