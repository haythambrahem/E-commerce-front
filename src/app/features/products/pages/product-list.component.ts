import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, ProductPageParams } from '../services/product.service';
import { Product, ApiPage } from '../../../core/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-list-container">
      <header class="page-header">
        <h1>Products</h1>
        <a routerLink="/products/new" class="btn btn-primary">Add Product</a>
      </header>

      @if (loading) {
        <div class="loading">Loading products...</div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (!loading && !errorMessage) {
        <div class="products-grid">
          @for (product of products; track product.id) {
            <div class="product-card">
              <h3>{{ product.name }}</h3>
              <p class="description">{{ product.description }}</p>
              <div class="product-info">
                <span class="price">\${{ product.price | number:'1.2-2' }}</span>
                <span class="stock" [class.low-stock]="product.stock < 10">
                  Stock: {{ product.stock }}
                </span>
              </div>
              @if (product.categoryName) {
                <span class="category">{{ product.categoryName }}</span>
              }
              <div class="actions">
                <a [routerLink]="['/products', product.id]" class="btn btn-secondary">View</a>
                <a [routerLink]="['/products', product.id, 'edit']" class="btn btn-secondary">Edit</a>
                <button (click)="deleteProduct(product)" class="btn btn-danger">Delete</button>
              </div>
            </div>
          } @empty {
            <div class="no-data">No products found.</div>
          }
        </div>

        @if (pageData) {
          <div class="pagination">
            <button 
              (click)="loadPage(currentPage - 1)" 
              [disabled]="currentPage === 0"
              class="btn">
              Previous
            </button>
            <span class="page-info">
              Page {{ currentPage + 1 }} of {{ pageData.totalPages }}
              ({{ pageData.totalElements }} total)
            </span>
            <button 
              (click)="loadPage(currentPage + 1)" 
              [disabled]="currentPage >= pageData.totalPages - 1"
              class="btn">
              Next
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 20px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .product-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      background: white;
    }
    .product-card h3 {
      margin: 0 0 8px 0;
    }
    .description {
      color: #666;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .product-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .price {
      font-weight: bold;
      color: #2e7d32;
    }
    .stock {
      color: #666;
    }
    .low-stock {
      color: #d32f2f;
    }
    .category {
      display: inline-block;
      background: #e3f2fd;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 12px;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
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
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 20px;
    }
    .page-info {
      color: #666;
    }
    .loading, .error-message, .no-data {
      text-align: center;
      padding: 40px;
    }
    .error-message {
      color: #d32f2f;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  pageData: ApiPage<Product> | null = null;
  loading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    if (page < 0) return;
    
    this.loading = true;
    this.errorMessage = '';

    const params: ProductPageParams = {
      page,
      size: this.pageSize
    };

    this.productService.getPage(params).subscribe({
      next: (data) => {
        this.pageData = data;
        this.products = data.content;
        this.currentPage = data.number;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  deleteProduct(product: Product): void {
    if (!product.id || !confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    this.productService.delete(product.id).subscribe({
      next: () => {
        // Reload current page after deletion
        this.loadPage(this.currentPage);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}
