import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Budget } from '../models/budget-details';
import { BudgetSummary } from '../models/budget-summary';

@Injectable({
  providedIn: 'root'
})
export class BudgetDetailsService {

  baseurl = "http://localhost:5287/api/Budget";
  constructor(private http: HttpClient,) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  GetBudget(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.baseurl, {
      headers: this.getAuthHeaders()
    });
  }

  addBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.baseurl, budget, {
      headers: this.getAuthHeaders()
    });
  }

  getCurrentMonthSummary(): Observable<BudgetSummary[]> {
    return this.http.get<BudgetSummary[]>(`${this.baseurl}/current-summary`, {
      headers: this.getAuthHeaders()
    });
  }
}
