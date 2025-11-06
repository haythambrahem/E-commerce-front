import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/interface/product';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { OrderItem } from '../../../core/interface/order-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,FormsModule  
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  quantity: { [key: number]: number } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: () => this.toastr.error('Erreur chargement produits')
    });
  }

  addToCart(product: Product): void {
    const qty = this.quantity[product.id!] || 1;
    const item: OrderItem = { product, quantity: qty, subtotal: product.price * qty };
    this.cartService.addToCart(item);
    this.toastr.success(`${product.name} ajouté au panier`);
  }
}
