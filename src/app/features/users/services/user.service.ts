import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPage, User } from '../../../core/models';

export interface UserPageParams {
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getPage(params: UserPageParams = {}): Observable<ApiPage<User>> {
    let httpParams = new HttpParams();
    
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }

    return this.http.get<ApiPage<User>>('/users', { params: httpParams });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`/users/${id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>('/users', user);
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`/users/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/users/${id}`);
  }
}
