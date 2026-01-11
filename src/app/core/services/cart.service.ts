import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderItem } from '../interface/order-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: OrderItem[] = [];
  private cartSubject = new BehaviorSubject<OrderItem[]>([]);

  constructor() {
    const storedCart = localStorage.getItem('flower_cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  getCart() {
    return this.cartSubject.asObservable();
  }

  addToCart(item: OrderItem) {
    const existing = this.cartItems.find(i => i.product.id === item.product.id);
    if (existing) {
      existing.quantity += item.quantity;
      existing.subtotal = existing.product.price * existing.quantity;
    } else {
      this.cartItems.push(item);
    }
    this.updateCart();
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(i => i.product.id !== productId);
    this.updateCart();
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, i) => sum + i.subtotal, 0);
  }

  private updateCart() {
    this.cartSubject.next(this.cartItems);
    localStorage.setItem('flower_cart', JSON.stringify(this.cartItems));
  }
}
