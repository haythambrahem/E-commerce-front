import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService, CategoryPageParams } from '../services/category.service';
import { Category, ApiPage } from '../../../core/models';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-list-container">
      <header class="page-header">
        <h1>Categories</h1>
        <a routerLink="/categories/new" class="btn btn-primary">Add Category</a>
      </header>

      @if (loading) {
        <div class="loading">Loading categories...</div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (!loading && !errorMessage) {
        <div class="categories-list">
          @for (category of categories; track category.id) {
            <div class="category-card">
              <div class="category-info">
                <h3>{{ category.name }}</h3>
                <p>{{ category.description || 'No description' }}</p>
              </div>
              <div class="actions">
                <a [routerLink]="['/categories', category.id, 'edit']" class="btn btn-secondary">Edit</a>
                <button (click)="deleteCategory(category)" class="btn btn-danger">Delete</button>
              </div>
            </div>
          } @empty {
            <div class="no-data">No categories found.</div>
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
    .category-list-container {
      padding: 20px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .category-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      background: white;
    }
    .category-info h3 {
      margin: 0 0 4px 0;
    }
    .category-info p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    .actions {
      display: flex;
      gap: 8px;
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
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  pageData: ApiPage<Category> | null = null;
  loading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    if (page < 0) return;
    
    this.loading = true;
    this.errorMessage = '';

    const params: CategoryPageParams = {
      page,
      size: this.pageSize
    };

    this.categoryService.getPage(params).subscribe({
      next: (data) => {
        this.pageData = data;
        this.categories = data.content;
        this.currentPage = data.number;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  deleteCategory(category: Category): void {
    if (!category.id || !confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.loadPage(this.currentPage);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}
