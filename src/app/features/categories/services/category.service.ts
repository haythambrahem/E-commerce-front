import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPage, Category } from '../../../core/models';

export interface CategoryPageParams {
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getPage(params: CategoryPageParams = {}): Observable<ApiPage<Category>> {
    let httpParams = new HttpParams();
    
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }

    return this.http.get<ApiPage<Category>>('/categories', { params: httpParams });
  }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>('/categories/all');
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`/categories/${id}`);
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>('/categories', category);
  }

  update(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`/categories/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/categories/${id}`);
  }
}
