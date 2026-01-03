import { Routes } from '@angular/router';

// Pages publiques (Client)
import { Home } from './features/Admin/home/home';
import { ProductList } from './features/client/product-list/product-list';
import { CategoryComponent } from './features/Admin/category/category.component';
import { About } from './features/client/about/about';
import { Contact } from './features/client/contact/contact';
import { BestSellers } from './features/client/best-sellers/best-sellers';
import { Login } from './features/client/login/login';
import { SignIn } from './features/client/sign-in/sign-in';
import { ForgotPassword } from './features/client/forgot-password/forgot-password';
import { CartComponent } from './features/client/cart-component/cart-component';

// Admin
import { AdminPanel } from './features/admin-dashboard/admin-panel';
import { AdminDashboard } from './features/admin-dashboard/admin-dashboard/admin-dashboard';
import { ProductAdmin } from './features/admin-dashboard/product-admin/product-admin';
import { UserAdmin } from './features/admin-dashboard/UserAdmin/user-admin';
import { CommandAdmin } from './features/admin-dashboard/CommandAdmin/command-admin';

export const routes: Routes = [
  // Redirection par défaut
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // 🌸 Pages publiques (CLIENT)
  { path: 'home', component: Home },
  { path: 'products', component: ProductList }, // Boutique
  { path: 'categories', component: CategoryComponent },
  { path: 'best-sellers', component: BestSellers },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },

  // 🛒 Panier
  { path: 'cart', component: CartComponent },

  // 🔐 Authentification
  { path: 'login', component: Login },
  { path: 'register', component: SignIn },
  { path: 'forgot-password', component: ForgotPassword },

  // 🛠️ Admin
  {
    path: 'admin/dashboard',
    component: AdminPanel,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'products', component: ProductAdmin },
      { path: 'commands', component: CommandAdmin },
      { path: 'users', component: UserAdmin },
    ],
  },

  // ❌ Toute route inconnue
  { path: '**', redirectTo: 'home' },
];
