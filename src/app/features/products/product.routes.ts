import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/product-form.component').then(m => m.ProductFormComponent)
  }
];
