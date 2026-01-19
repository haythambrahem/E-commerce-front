import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPage, Product } from '../../../core/models';

export interface ProductPageParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getPage(params: ProductPageParams = {}): Observable<ApiPage<Product>> {
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

    return this.http.get<ApiPage<Product>>('/products', { params: httpParams });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`/products/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>('/products', product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`/products/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/products/${id}`);
  }

  getByCategory(categoryId: number, params: ProductPageParams = {}): Observable<ApiPage<Product>> {
    let httpParams = new HttpParams();
    
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }

    return this.http.get<ApiPage<Product>>(`/products/category/${categoryId}`, { params: httpParams });
  }
}
