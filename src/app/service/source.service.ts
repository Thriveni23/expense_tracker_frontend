import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  private baseUrl = 'http://localhost:5287/api/Source';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllSources(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  addSource(source: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, source, {
      headers: this.getAuthHeaders()
    });
  }

  deleteSource(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
