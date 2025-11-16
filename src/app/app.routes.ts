import { Routes } from '@angular/router';
import { Home } from './features/Admin/home/home';
import { AdminPanel } from './features/admin-dashboard/admin-panel';
import { ProductList } from './features/client/product-list/product-list';
import { About } from './features/client/about/about';
import { Contact } from './features/client/contact/contact';
import { BestSellers } from './features/client/best-sellers/best-sellers';
import { SignIn } from './features/client/sign-in/sign-in';
import { ForgotPassword } from './features/client/forgot-password/forgot-password';
//import { ProductComponent } from './features/Admin/product/product-management.component';
import { ProductAdmin } from './features/admin-dashboard/product-admin/product-admin';
import { Login } from './features/client/login/login';
import { CartComponent } from './features/client/cart-component/cart-component';
import { AdminDashboard } from './features/admin-dashboard/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // 🏠 HOME avec routes enfants
  {
    path: 'home',
    component: Home,

  },
 
  {
    path: 'admin/dashboard',
    component: AdminPanel,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'products', component: ProductAdmin },
    ],
  },

  // autres routes
  { path: 'login', component: Login },
  { path: 'register', component: SignIn },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'cart', component: CartComponent },

 
  { path: '**', redirectTo: 'home' },
];
