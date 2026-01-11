import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/interface/product';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { OrderItem } from '../../../core/interface/order-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // ✅ ajouté ActivatedRoute
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  menuOpen = false;
  cartOpen = false;
  showDropdown = false;
  activeSection = 'home';
  cartCount = 0;

  products: Product[] = [];
  quantity: { [key: number]: number } = {};
  backendUrl = 'http://localhost:8082';

  constructor(
    private productService: ProductService,
    public authService: AuthService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute // ✅ injecté pour récupérer queryParams
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // ✅ Si on arrive sur /home avec queryParams pour scroller
    this.route.queryParams.subscribe(params => {
      if (params['section'] && this.router.url === '/home') {
        const element = document.getElementById(params['section']);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: data => {
        this.products = data.map(p => ({
          ...p,
          imageUrl: p.imageUrl ? this.backendUrl + p.imageUrl : ''
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

  /**
   * ✅ Version intelligente de scroll/redirection
   */
  goToSection(sectionId: string): void {
    // Si on est déjà sur /home
    if (this.router.url === '/home') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Sinon, redirige vers /home avec queryParams pour scroller
      this.router.navigate(['/home'], { queryParams: { section: sectionId } });
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
