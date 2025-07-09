import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = 'http://localhost:5287/api/Category';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  addCategory(category: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, category, {
      headers: this.getAuthHeaders()
    });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
