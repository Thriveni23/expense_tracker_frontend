import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Budget } from '../models/budget-details';
import { BudgetSummary } from '../models/budget-summary';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetDetailsService {

  baseurl = "http://localhost:5287/api/Budget";
  constructor(private http: HttpClient,) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  GetBudget(): Observable<Budget[]> {
    return this.http.get<any>(this.baseurl, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ Extract actual array
    );
  }

  addBudget(budget: Budget): Observable<Budget> {
    return this.http.post<any>(this.baseurl, budget, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ Extract added object
    );
  }

   getCurrentMonthSummary(): Observable<BudgetSummary[]> {
    return this.http.get<any>(`${this.baseurl}/current-summary`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ Extract summary array
    );
  }
}
