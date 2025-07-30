import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Income } from '../models/income-details';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeDetailsService {

  constructor(private httpclient: HttpClient) { }
  baseurl = "http://localhost:5287/api/Incomes";

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

 GetIncome(): Observable<Income[]> {
    return this.httpclient.get<any>(this.baseurl, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ extract actual array
    );
  }


  insertIncome(income: Income): Observable<Income> {
    return this.httpclient.post<any>(this.baseurl, income, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ extract inserted income object
    );
  }


  updateIncome(id: number, income: Income): Observable<Income> {
    return this.httpclient.put<any>(`${this.baseurl}/${id}`, income, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ extract updated income object
    );
  }

  deleteIncome(id: number): Observable<any> {
    return this.httpclient.delete(`${this.baseurl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
