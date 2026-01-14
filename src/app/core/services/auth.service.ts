import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interface/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // ✅ Restaurer l'utilisateur depuis localStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // ✅ IMPORTANT : getter utilisé par CartService
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(user: User) {
    if (!user) return;

    // ✅ Sauvegarde user
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);

    // ✅ Normalisation du rôle
    const roleName =
      user?.role?.toUpperCase() ||
      user?.roles?.[0]?.name?.toUpperCase() ||
      '';

    console.log("Rôle de l'utilisateur connecté :", roleName);

    // ✅ Navigation
    setTimeout(() => {
      if (roleName === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    }, 100);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getRole(): string | null {
    return this.currentUserSubject.value?.roles?.[0]?.name ?? null;
  }
}
