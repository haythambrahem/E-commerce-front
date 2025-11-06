import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interface/product';
import { Category } from '../../../core/interface/category';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-product',
  imports: [ CommonModule,          // ✅ nécessaire pour *ngFor
    ReactiveFormsModule, ], // ✅ nécessaire pour les formulaires réactifs
  standalone: true,          // ✅ recommandé dans Angular 20
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']

})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productForm!: FormGroup;
  editingProductId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      stock: [0, Validators.required],
      category: [null, Validators.required],
       imageUrl: ['']
    });

    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: data => this.products = data,
      error: () => this.toastr.error('Erreur lors du chargement des produits')
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: data => this.categories = data,
      error: () => this.toastr.error('Erreur lors du chargement des catégories')
    });
  }

  submit() {
    if (this.productForm.invalid) return;
    const product: Product = this.productForm.value;

    if (this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, product).subscribe({
        next: () => {
          this.toastr.success('Produit mis à jour');
          this.productForm.reset();
          this.editingProductId = null;
          this.loadProducts();
        },
        error: () => this.toastr.error('Erreur lors de la mise à jour')
      });
    } else {
      this.productService.createProduct(product).subscribe({
        next: () => {
          this.toastr.success('Produit créé');
          this.productForm.reset();
          this.loadProducts();
        },
        error: () => this.toastr.error('Erreur lors de la création')
      });
    }
  }

  editProduct(product: Product) {
    this.editingProductId = product.id || null;
    this.productForm.patchValue(product);
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Produit supprimé');
        this.loadProducts();
      },
      error: () => this.toastr.error('Erreur lors de la suppression')
    });
  }
}