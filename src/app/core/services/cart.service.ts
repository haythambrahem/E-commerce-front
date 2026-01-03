import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderItem } from '../interface/order-item';

@Injectable({
  providedIn: 'root' // Une seule instance pour toute l'app
})
export class CartService {
  private cartItems: OrderItem[] = [];
  private cartSubject = new BehaviorSubject<OrderItem[]>([]);

  constructor() {
    // Charger le panier depuis le localStorage si existant
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cartItems = JSON.parse(saved);
      this.cartSubject.next([...this.cartItems]);
    }
  }

  // Observable pour tous les composants
  getCart() {
    return this.cartSubject.asObservable();
  }

  // Ajouter un produit
  addToCart(item: OrderItem) {
    const existing = this.cartItems.find(i => i.product.id === item.product.id);
    if (existing) {
      existing.quantity += item.quantity;
      existing.subtotal = existing.product.price * existing.quantity;
    } else {
      this.cartItems.push(item);
    }
    this.saveCart();
    this.cartSubject.next([...this.cartItems]);
    console.log('CartService cartItems:', this.cartItems);
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(i => i.product.id !== productId);
    this.saveCart();
    this.cartSubject.next([...this.cartItems]);
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
    this.cartSubject.next([...this.cartItems]);
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, i) => sum + i.subtotal, 0);
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}
