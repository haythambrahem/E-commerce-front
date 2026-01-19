import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order, OrderStatus } from '../../../core/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="order-detail-container">
      @if (loading) {
        <div class="loading">Loading order...</div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (order && !loading) {
        <div class="order-detail">
          <header class="detail-header">
            <div>
              <h1>Order #{{ order.id }}</h1>
              <span class="status-badge" [class]="'status-' + order.status?.toLowerCase()">
                {{ order.status }}
              </span>
            </div>
            <div class="actions">
              <a routerLink="/orders" class="btn btn-secondary">Back to List</a>
            </div>
          </header>

          <div class="detail-content">
            <div class="detail-grid">
              <div class="detail-item">
                <label>Order Date</label>
                <span>{{ order.date | date:'medium' }}</span>
              </div>

              <div class="detail-item">
                <label>Customer</label>
                <span>{{ order.userName || 'User #' + order.userId }}</span>
              </div>

              <div class="detail-item">
                <label>Total</label>
                <span class="total">\${{ order.total | number:'1.2-2' }}</span>
              </div>
            </div>

            <div class="status-section">
              <h3>Update Status</h3>
              <div class="status-buttons">
                @for (status of statuses; track status) {
                  <button 
                    (click)="updateStatus(status)"
                    [class.active]="order.status === status"
                    [disabled]="order.status === status"
                    class="btn status-btn">
                    {{ status }}
                  </button>
                }
              </div>
            </div>

            @if (order.orderItems && order.orderItems.length > 0) {
              <div class="items-section">
                <h3>Order Items</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Unit Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of order.orderItems; track item.id) {
                      <tr>
                        <td>{{ item.productName || 'Product #' + item.productId }}</td>
                        <td>\${{ item.productPrice | number:'1.2-2' }}</td>
                        <td>{{ item.quantity }}</td>
                        <td class="subtotal">\${{ item.subtotal | number:'1.2-2' }}</td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="text-right"><strong>Total</strong></td>
                      <td class="total"><strong>\${{ order.total | number:'1.2-2' }}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .order-detail-container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .detail-header h1 {
      margin: 0 0 8px 0;
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
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
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
    .total {
      font-size: 20px;
      font-weight: bold;
      color: #2e7d32;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
    }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-confirmed { background: #e3f2fd; color: #1565c0; }
    .status-processing { background: #e8f5e9; color: #2e7d32; }
    .status-shipped { background: #f3e5f5; color: #7b1fa2; }
    .status-delivered { background: #e8f5e9; color: #1b5e20; }
    .status-cancelled { background: #ffebee; color: #c62828; }
    .status-section, .items-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }
    .status-section h3, .items-section h3 {
      margin: 0 0 16px 0;
    }
    .status-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .status-btn {
      padding: 8px 16px;
    }
    .status-btn.active {
      background: #1976d2;
      color: white;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
    }
    .items-table th,
    .items-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    .items-table th {
      background: #f5f5f5;
      font-weight: 600;
    }
    .items-table tfoot td {
      border-top: 2px solid #e0e0e0;
      border-bottom: none;
    }
    .text-right {
      text-align: right;
    }
    .subtotal {
      font-weight: 500;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      font-size: 14px;
      background: #e0e0e0;
      color: #333;
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
      padding: 40px;
    }
    .error-message {
      color: #d32f2f;
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = false;
  errorMessage = '';
  statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(Number(id));
    }
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  updateStatus(status: OrderStatus): void {
    if (!this.order?.id) return;

    this.orderService.updateStatus(this.order.id, status).subscribe({
      next: (updatedOrder) => {
        // Use backend response as source of truth
        this.order = updatedOrder;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}
