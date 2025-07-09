import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5287/api/Admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-users`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-user/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllIncomes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-incomes`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-transactions`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllSavings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-savings`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllBudgets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all-budgets`, {
      headers: this.getAuthHeaders()
    });
  }

 
}
