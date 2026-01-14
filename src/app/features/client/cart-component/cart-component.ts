import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/interface/order';
import { OrderItem } from '../../../core/interface/order-item';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './cart-component.html',
  styleUrls: ['./cart-component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  cartItems: OrderItem[] = [];
  total = 0;
  private sub!: Subscription;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  // finalizeOrder() {
  //   if (this.cartItems.length === 0) return;

  //   const order: Order = {
  //     total: this.total,
  //     status: 'EN_ATTENTE',
  //     orderitemList: this.cartItems
  //   };

  //   this.orderService.createOrder(order).subscribe({
  //     next: () => {
  //       this.cartService.clearCart();
  //       alert('Commande envoyée avec succès 🌸');
  //       this.router.navigate(['/home']);
  //     },
  //     error: err => console.error('Erreur création commande', err)
  //   });
  // }
finalizeOrder() {
  if (this.cartItems.length === 0) return;

  const userId = 1; // ID de l'utilisateur connecté (à récupérer dynamiquement plus tard)
  const order: Order = {
    total: this.total,
    status: 'EN_ATTENTE',
    orderitemList: this.cartItems,
    user: { id: userId } // ✅ fonctionne avec Partial<User>
  };

  this.orderService.createOrder(order, userId).subscribe({
    next: () => {
      this.cartService.clearCart();
      alert('Commande envoyée avec succès 🌸');
      this.router.navigate(['/home']);
    },
    error: err => console.error('Erreur création commande', err)
  });
}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.total = this.cartService.getTotal();
  }

  // ✅ Clear all cart items
  clearCart() {
    this.cartService.clearCart();
    this.total = 0;
  }
}
