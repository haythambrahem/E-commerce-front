import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  private apiUrl = 'http://localhost:8082/api/orders'; // ton endpoint Spring Boot

  constructor(private http: HttpClient) {}

  getAllCommands(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateCommandStatus(commandId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${commandId}/status`, { status });
  }
}
