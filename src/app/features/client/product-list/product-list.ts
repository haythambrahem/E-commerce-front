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
  templateUrl: './product-list.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  products: Product[] = [];
  quantity: { [key: number]: number } = {};
  backendUrl = 'http://localhost:8082';

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
    next: data => {
      console.log('DATA FROM BACKEND 👉', data);

      this.products = data.map(p => ({
        ...p,
        imageUrl: this.backendUrl + p.imageUrl
      }));

      console.log('PRODUCTS ARRAY 👉', this.products);
    },
    error: err => console.error('ERROR 👉', err)
  });
}

  addToCart(product: Product) {
    const qty = this.quantity[product.id!] || 1;

    const item: OrderItem = {
      product: { ...product },
      quantity: qty,
      subtotal: product.price * qty
    };

    this.cartService.addToCart(item);
    this.toastr.success(`${product.name} ajouté au panier`);
  }
}
