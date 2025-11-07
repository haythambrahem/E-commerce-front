import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
 products = [
    { id: 1, name: 'Rose Rouge', price: 15.5, stock: 25 },
    { id: 2, name: 'Tulipe Jaune', price: 12, stock: 10 },
    { id: 3, name: 'Orchidée Blanche', price: 22.3, stock: 8 },
  ];
}
