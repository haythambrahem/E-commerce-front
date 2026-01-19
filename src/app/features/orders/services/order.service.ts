import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPage, Order, OrderStatus } from '../../../core/models';

export interface OrderPageParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: string;
}

export interface CreateOrderRequest {
  userId: number;
  items: { productId: number; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  getPage(params: OrderPageParams = {}): Observable<ApiPage<Order>> {
    let httpParams = new HttpParams();
    
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.direction) {
      httpParams = httpParams.set('direction', params.direction);
    }

    return this.http.get<ApiPage<Order>>('/orders', { params: httpParams });
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`/orders/${id}`);
  }

  getByUserId(userId: number, params: OrderPageParams = {}): Observable<ApiPage<Order>> {
    let httpParams = new HttpParams();
    
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }

    return this.http.get<ApiPage<Order>>(`/orders/user/${userId}`, { params: httpParams });
  }

  create(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>('/orders', request);
  }

  updateStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`/orders/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/orders/${id}`);
  }
}
