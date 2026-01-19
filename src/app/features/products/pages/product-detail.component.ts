import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-detail-container">
      @if (loading) {
        <div class="loading">Loading product...</div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (product && !loading) {
        <div class="product-detail">
          <header class="detail-header">
            <h1>{{ product.name }}</h1>
            <div class="actions">
              <a [routerLink]="['/products', product.id, 'edit']" class="btn btn-primary">Edit</a>
              <button (click)="deleteProduct()" class="btn btn-danger">Delete</button>
              <a routerLink="/products" class="btn btn-secondary">Back to List</a>
            </div>
          </header>

          <div class="detail-content">
            <div class="detail-section">
              <h3>Description</h3>
              <p>{{ product.description || 'No description available' }}</p>
            </div>

            <div class="detail-grid">
              <div class="detail-item">
                <label>Price</label>
                <span class="price">\${{ product.price | number:'1.2-2' }}</span>
              </div>

              <div class="detail-item">
                <label>Stock</label>
                <span [class.low-stock]="product.stock < 10">{{ product.stock }} units</span>
              </div>

              @if (product.categoryName) {
                <div class="detail-item">
                  <label>Category</label>
                  <span>{{ product.categoryName }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-detail-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .detail-header h1 {
      margin: 0;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .detail-content {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 24px;
    }
    .detail-section {
      margin-bottom: 24px;
    }
    .detail-section h3 {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .detail-item label {
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
    }
    .price {
      font-size: 24px;
      font-weight: bold;
      color: #2e7d32;
    }
    .low-stock {
      color: #d32f2f;
    }
    .btn {
      padding: 8px 16px;
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
    .btn-danger {
      background: #d32f2f;
      color: white;
    }
    .loading, .error-message {
      text-align: center;
      padding: 40px;
    }
    .error-message {
      color: #d32f2f;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(Number(id));
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  deleteProduct(): void {
    if (!this.product?.id || !confirm(`Are you sure you want to delete "${this.product.name}"?`)) {
      return;
    }

    this.productService.delete(this.product.id).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}
