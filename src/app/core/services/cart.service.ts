import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderItem } from '../interface/order-item';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: OrderItem[] = [];
  private cart$ = new BehaviorSubject<OrderItem[]>([]);

  getCart() {
    return this.cart$.asObservable();
  }

  addToCart(item: OrderItem) {
    const existing = this.items.find(i => i.product.id === item.product.id);
    if (existing) existing.quantity += item.quantity;
    else this.items.push(item);
    this.cart$.next(this.items);
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.cart$.next(this.items);
  }

  clearCart() {
    this.items = [];
    this.cart$.next(this.items);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
}
