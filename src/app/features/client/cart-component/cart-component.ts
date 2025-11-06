import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { OrderItem } from '../../../core/interface/order-item';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-component.html',
  styleUrls: ['./cart-component.css']
})
export class CartComponent implements OnInit {
  items: OrderItem[] = [];
  total = 0;

  constructor(private cartService: CartService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.items = items;
      this.total = items.reduce((sum, i) => sum + i.subtotal, 0);
    });
  }

  remove(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.toastr.info('Produit supprimé du panier');
  }

  clear(): void {
    this.cartService.clearCart();
    this.toastr.info('Panier vidé');
  }
}
