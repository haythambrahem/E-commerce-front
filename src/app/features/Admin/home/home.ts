import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interface/product';

/* ✅ CLÉ DE STOCKAGE LOCAL */
const CART_KEY = 'flower_cart';

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
  cartCount = 0;

  constructor(
    public authService: AuthService,
    private productService: ProductService,
  ) {}

 ngOnInit(): void {
  this.loadProducts();           // Charge tous les produits depuis le backend
  this.loadCartFromStorage();    // Charge le panier existant
}

loadProducts(): void {
  this.productService.getAllProducts().subscribe({
    next: data => {
      // Trier par id décroissant pour prendre les derniers produits
      const sorted = data.sort((a, b) => b.id! - a.id!);

      // Prendre les 4 derniers et ajouter l'URL complète pour l'image
      this.products = sorted.slice(0, 4).map(p => ({
        ...p,
        imageUrl: p.imageUrl ? 'http://localhost:8082' + p.imageUrl : ''
      }));
    },
    error: err => console.error('Erreur chargement produits:', err)
  });
}



  /* ================= PANIER ================= */

  loadCartFromStorage(): void {
    const storedCart = localStorage.getItem(CART_KEY);
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartCount = this.cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }
  }

  saveCartToStorage(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cartItems));
  }

  addToCart(product: Product): void {
    const item = this.cartItems.find(i => i.id === product.id);

    if (item) {
      item.quantity++;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }

    this.cartCount = this.cartItems.reduce(
      (sum, i) => sum + i.quantity,
      0
    );

    this.saveCartToStorage(); // 🔥 SAUVEGARDE
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.cartCount = this.cartItems.reduce(
      (sum, i) => sum + i.quantity,
      0
    );
    this.saveCartToStorage();
  }

  getCartTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  /* ================= PRODUITS ================= */

  // loadProducts(): void {
  //   this.productService.getAllProducts().subscribe({
  //     next: data => (this.products = data),
  //     error: err => console.error('Erreur chargement produits:', err)
  //   });
  // }

  /* ================= UI ================= */

  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
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
