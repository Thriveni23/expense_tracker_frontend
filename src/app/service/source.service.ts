import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  private baseUrl = 'http://localhost:5287/api/Source';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

getAllSources(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ Extract only the array of sources
    );
  }
  addSource(source: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, source, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ Extract the created source object
    );
  }

  deleteSource(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
