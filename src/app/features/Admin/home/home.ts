import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interface/product';

interface CartItem extends Product {
  quantity: number;
}

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

  cartItems: CartItem[] = [];
  products: Product[] = [];

  constructor(
    public authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Erreur chargement produits:', err)
    });
  }

  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }

  addToCart(product: Product) {
    const item = this.cartItems.find((i) => i.id === product.id);
    if (item) item.quantity++;
    else this.cartItems.push({ ...product, quantity: 1 });
  }

  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
