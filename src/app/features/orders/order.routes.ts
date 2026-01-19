import { Routes } from '@angular/router';

export const orderRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/order-list.component').then(m => m.OrderListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/order-form.component').then(m => m.OrderFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/order-detail.component').then(m => m.OrderDetailComponent)
  }
];
