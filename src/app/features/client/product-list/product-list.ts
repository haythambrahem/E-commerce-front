import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/interface/product';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { OrderItem } from '../../../core/interface/order-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ importer Router

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  products: Product[] = [];
  quantity: { [key: number]: number } = {};
  backendUrl = 'http://localhost:8082';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: data => {
        this.products = data.map(p => ({
          ...p,
          imageUrl: this.backendUrl + p.imageUrl
        }));
      },
      error: err => console.error(err)
    });
  }

  addToCart(product: Product) {
    if (!product.id) return;

    const qty = this.quantity[product.id] || 1;

    const item: OrderItem = {
      product: { ...product },
      quantity: qty,
      subtotal: product.price * qty
    };

    this.cartService.addToCart(item);
    this.toastr.success(`${product.name} ajouté au panier`);

    // 🔹 Redirection automatique vers le panier
    this.router.navigate(['/cart']);
  }
}
