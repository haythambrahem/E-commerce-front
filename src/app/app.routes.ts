import { Routes } from '@angular/router';
import { Home } from './features/Admin/home/home';
import { ProductList } from './features/client/product-list/product-list';
import { About } from './features/client/about/about';
import { Contact } from './features/client/contact/contact';
import { BestSellers } from './features/client/best-sellers/best-sellers';
import { SignIn } from './features/client/sign-in/sign-in';
import { ForgotPassword } from './features/client/forgot-password/forgot-password';
import { ProductComponent } from './features/Admin/product/product-management.component';
import { Login } from './features/client/login/login';
import { CartComponent } from './features/client/cart-component/cart-component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // 🏠 HOME avec routes enfants
  {
    path: 'home',
    component: Home,
    children: [
      { path: 'shop', component: ProductList },
      { path: 'about', component: About },
      { path: 'contact', component: Contact },
      { path: 'best-sellers', component: BestSellers },
    ],
  },

  // autres routes
  { path: 'login', component: Login },
  { path: 'register', component: SignIn },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'cart', component: CartComponent },

  // admin
  { path: 'admin/products', component: ProductComponent },

  { path: '**', redirectTo: 'home' },
];
