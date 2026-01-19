import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderService, CreateOrderRequest } from '../services/order.service';
import { ProductService } from '../../products/services/product.service';
import { UserService } from '../../users/services/user.service';
import { Product, User } from '../../../core/models';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="order-form-container">
      <header class="page-header">
        <h1>Create New Order</h1>
        <a routerLink="/orders" class="btn btn-secondary">Back to List</a>
      </header>

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="order-form">
        <div class="form-group">
          <label for="userId">Customer *</label>
          <select id="userId" formControlName="userId">
            <option [ngValue]="null">Select a customer</option>
            @for (user of users; track user.id) {
              <option [ngValue]="user.id">{{ user.username }} ({{ user.email }})</option>
            }
          </select>
          @if (form.get('userId')?.invalid && form.get('userId')?.touched) {
            <span class="error">Customer is required</span>
          }
        </div>

        <div class="items-section">
          <div class="items-header">
            <h3>Order Items</h3>
            <button type="button" (click)="addItem()" class="btn btn-secondary">Add Item</button>
          </div>

          <div formArrayName="items" class="items-list">
            @for (item of itemsArray.controls; track $index; let i = $index) {
              <div [formGroupName]="i" class="item-row">
                <div class="form-group">
                  <label>Product</label>
                  <select formControlName="productId">
                    <option [ngValue]="null">Select product</option>
                    @for (product of products; track product.id) {
                      <option [ngValue]="product.id">
                        {{ product.name }} - \${{ product.price }} ({{ product.stock }} in stock)
                      </option>
                    }
                  </select>
                </div>

                <div class="form-group quantity-group">
                  <label>Quantity</label>
                  <input type="number" formControlName="quantity" min="1">
                </div>

                <button type="button" (click)="removeItem(i)" class="btn btn-danger remove-btn">Remove</button>
              </div>
            }
          </div>

          @if (itemsArray.length === 0) {
            <div class="no-items">No items added. Click "Add Item" to add products to the order.</div>
          }
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid || submitting || itemsArray.length === 0" class="btn btn-primary">
            {{ submitting ? 'Creating...' : 'Create Order' }}
          </button>
          <a routerLink="/orders" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .order-form-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .order-form {
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
    .form-group select {
      width: 100%;
      padding: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
    }
    .form-group .error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }
    .items-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }
    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .items-header h3 {
      margin: 0;
    }
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .item-row {
      display: grid;
      grid-template-columns: 1fr 120px auto;
      gap: 12px;
      align-items: end;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .item-row .form-group {
      margin-bottom: 0;
    }
    .quantity-group input {
      width: 100%;
    }
    .remove-btn {
      height: 40px;
    }
    .no-items {
      padding: 20px;
      text-align: center;
      color: #666;
      background: #f5f5f5;
      border-radius: 4px;
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
    .btn-danger {
      background: #d32f2f;
      color: white;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error-message {
      color: #d32f2f;
      background: #ffebee;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
  `]
})
export class OrderFormComponent implements OnInit {
  form!: FormGroup;
  users: User[] = [];
  products: Product[] = [];
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.loadProducts();
  }

  private initForm(): void {
    this.form = this.fb.group({
      userId: [null, Validators.required],
      items: this.fb.array([])
    });
  }

  get itemsArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.itemsArray.push(itemGroup);
  }

  removeItem(index: number): void {
    this.itemsArray.removeAt(index);
  }

  private loadUsers(): void {
    this.userService.getPage({ size: 100 }).subscribe({
      next: (data) => {
        this.users = data.content;
      },
      error: (err) => {
        console.error('Failed to load users:', err.message);
      }
    });
  }

  private loadProducts(): void {
    this.productService.getPage({ size: 100 }).subscribe({
      next: (data) => {
        this.products = data.content;
      },
      error: (err) => {
        console.error('Failed to load products:', err.message);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.itemsArray.length === 0) return;

    this.submitting = true;
    this.errorMessage = '';

    const request: CreateOrderRequest = {
      userId: this.form.value.userId,
      items: this.form.value.items.map((item: { productId: number; quantity: number }) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.orderService.create(request).subscribe({
      next: () => {
        // Navigate to orders list - backend response is source of truth
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        // Display error from backend (e.g., insufficient stock)
        this.errorMessage = err.message;
        this.submitting = false;
      }
    });
  }
}
