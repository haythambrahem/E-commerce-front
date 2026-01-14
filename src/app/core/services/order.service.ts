import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../interface/order';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = 'http://localhost:8082/api/orders';

  constructor(private http: HttpClient) {}

 createOrder(order: Order, userId: number): Observable<Order> {
  return this.http.post<Order>(`${this.api}?userId=${userId}`, order);
}


  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.api);
  }

  updateOrder(id: number, order: Order) {
    return this.http.put<Order>(`${this.api}/${id}`, order);
  }

  deleteOrder(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
