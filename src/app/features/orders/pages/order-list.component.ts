import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, OrderPageParams } from '../services/order.service';
import { Order, ApiPage } from '../../../core/models';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="order-list-container">
      <header class="page-header">
        <h1>Orders</h1>
        <a routerLink="/orders/new" class="btn btn-primary">Create Order</a>
      </header>

      @if (loading) {
        <div class="loading">Loading orders...</div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (!loading && !errorMessage) {
        <div class="orders-table-container">
          <table class="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders; track order.id) {
                <tr>
                  <td>#{{ order.id }}</td>
                  <td>{{ order.date | date:'short' }}</td>
                  <td>{{ order.userName || 'User #' + order.userId }}</td>
                  <td class="total">\${{ order.total | number:'1.2-2' }}</td>
                  <td>
                    <span class="status-badge" [class]="'status-' + order.status?.toLowerCase()">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    <div class="actions">
                      <a [routerLink]="['/orders', order.id]" class="btn btn-small btn-secondary">View</a>
                      <button (click)="deleteOrder(order)" class="btn btn-small btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="no-data">No orders found.</td>
                </tr>
              }
            </tbody>
          </table>
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
    .order-list-container {
      padding: 20px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .orders-table-container {
      overflow-x: auto;
    }
    .orders-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .orders-table th,
    .orders-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    .orders-table th {
      background: #f5f5f5;
      font-weight: 600;
    }
    .orders-table tbody tr:hover {
      background: #fafafa;
    }
    .total {
      font-weight: 600;
      color: #2e7d32;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-confirmed { background: #e3f2fd; color: #1565c0; }
    .status-processing { background: #e8f5e9; color: #2e7d32; }
    .status-shipped { background: #f3e5f5; color: #7b1fa2; }
    .status-delivered { background: #e8f5e9; color: #1b5e20; }
    .status-cancelled { background: #ffebee; color: #c62828; }
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
    .btn-small {
      padding: 4px 8px;
      font-size: 12px;
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
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  pageData: ApiPage<Order> | null = null;
  loading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    if (page < 0) return;
    
    this.loading = true;
    this.errorMessage = '';

    const params: OrderPageParams = {
      page,
      size: this.pageSize
    };

    this.orderService.getPage(params).subscribe({
      next: (data) => {
        this.pageData = data;
        this.orders = data.content;
        this.currentPage = data.number;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  deleteOrder(order: Order): void {
    if (!order.id || !confirm(`Are you sure you want to delete order #${order.id}?`)) {
      return;
    }

    this.orderService.delete(order.id).subscribe({
      next: () => {
        this.loadPage(this.currentPage);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}
