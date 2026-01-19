import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/product.routes').then(m => m.productRoutes)
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/categories/category.routes').then(m => m.categoryRoutes)
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/order.routes').then(m => m.orderRoutes)
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/user.routes').then(m => m.userRoutes)
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];
