import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// ✅ Définir l'interface des statistiques
export interface DashboardStats {
  products: number;
  orders: number;
  users: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8082/api/dashboard'; // ton backend Spring Boot

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer les stats du dashboard
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
}
