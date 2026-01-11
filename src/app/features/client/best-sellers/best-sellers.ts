import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/interface/product';
import { OrderItem } from '../../../core/interface/order-item';
import { Category } from '../../../core/interface/category';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-sellers.html',
  styleUrls: ['./best-sellers.css'],
})
export class BestSellers implements OnInit {

  bestSellers: Product[] = [];
  backendUrl = 'http://localhost:8082';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadBestSellers();
  }

  loadBestSellers() {

    const bestCategory: Category = {
      id: 1,
      name: 'Best Sellers'
    };

    this.bestSellers = [
      {
        id: 1,
        name: 'Produit Star',
        description: 'Meilleure vente de la boutique',
        price: 25,
        stock: 10,
        category: bestCategory,
        imageUrl: this.backendUrl + '/images/p1.jpg'
      },
      {
        id: 2,
        name: 'Top Vente',
        description: 'Produit très apprécié par nos clients',
        price: 40,
        stock: 8,
        category: bestCategory,
        imageUrl: this.backendUrl + '/images/p2.jpg'
      }
    ];
  }

  addToCart(product: Product) {
    const item: OrderItem = {
      product,
      quantity: 1,
      subtotal: product.price
    };

    this.cartService.addToCart(item);
    alert(`🛒 ${product.name} ajouté au panier`);
  }
}
