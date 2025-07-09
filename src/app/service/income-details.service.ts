import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Income } from '../models/income-details';

@Injectable({
  providedIn: 'root'
})
export class IncomeDetailsService {

  constructor(private httpclient: HttpClient) { }
  baseurl = "http://localhost:5287/api/Incomes";

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  GetIncome(): Observable<Income[]> {
    return this.httpclient.get<Income[]>(this.baseurl, {
      headers: this.getAuthHeaders()
    });
  }

  insertIncome(income: Income): Observable<Income> {
    return this.httpclient.post<Income>(this.baseurl, income, {
      headers: this.getAuthHeaders()
    });
  }

  updateIncome(id: number, income: Income): Observable<Income> {
    return this.httpclient.put<Income>(`${this.baseurl}/${id}`, income, {
      headers: this.getAuthHeaders()
    });
  }

  deleteIncome(id: number): Observable<any> {
    return this.httpclient.delete(`${this.baseurl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
