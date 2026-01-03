import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { OrderItem } from '../../../core/interface/order-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart-component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./cart-component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: OrderItem[] = [];
  total = 0;
  private cartSub!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSub = this.cartService.getCart().subscribe(items => {
      console.log('CartComponent Items:', items);
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
  }
}
