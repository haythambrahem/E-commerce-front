import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../interface/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8082/api/users'; // URL de ton backend Spring Boot

  constructor(private http: HttpClient, private authService: AuthService) {}
 // 🔹 Créer un utilisateur (inscription)
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // 🔹 Récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // 🔹 Récupérer un utilisateur par ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Mettre à jour un utilisateur
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // 🔹 Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // // 🔹 Authentification (exemple simple sans JWT)
  // login(email: string, password: string): Observable<User | null> {
  //   return new Observable((observer) => {
  //     this.getAllUsers().subscribe((users) => {
  //       const user = users.find(
  //         (u) => u.email === email && u.password === password
  //       );
  //       observer.next(user || null);
  //       observer.complete();
  //     });
  //   });
  // }
   // 🔹 Authentification (avec backend)
login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        // ✅ Sauvegarde token + utilisateur
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }

        if (response) {
          localStorage.setItem('user', JSON.stringify(response));

          // ✅ Mise à jour immédiate du service d'auth
          this.authService.login(response);
        }
      })
    );
  }








}
