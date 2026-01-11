import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interface/product';
import { CartService } from '../../../core/services/cart.service'; // ✅ Import

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  menuOpen = false;
  cartOpen = false;
  showDropdown = false;
  activeSection = 'home';

  products: Product[] = [];
  cartCount = 0;

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private cartService: CartService // ✅ Inject service
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // Subscribe to cart updates
    this.cartService.getCart().subscribe(items => {
      this.cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: data => {
        const sorted = data.sort((a, b) => b.id! - a.id!);
        this.products = sorted.slice(0, 4).map(p => ({
          ...p,
          imageUrl: p.imageUrl ? 'http://localhost:8082' + p.imageUrl : ''
        }));
      },
      error: err => console.error('Erreur chargement produits:', err)
    });
  }

  addToCart(product: Product): void {
    if (!product.id) return;

    const orderItem = {
      product,
      quantity: 1,
      subtotal: product.price
    };

    this.cartService.addToCart(orderItem); // ✅ Use service
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.menuOpen = false;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleCart(): void {
    this.cartOpen = !this.cartOpen;
  }
}
