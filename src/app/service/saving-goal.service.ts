import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SavingGoal } from '../models/savings-goals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SavingGoalService {
  private baseUrl = 'http://localhost:5287/api/SavingGoals';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addGoal(goal: SavingGoal): Observable<SavingGoal> {
    return this.http.post<SavingGoal>(this.baseUrl, goal, {
      headers: this.getAuthHeaders()
    });
  }

  getGoals(): Observable<SavingGoal[]> {
    return this.http.get<SavingGoal[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  deleteGoal(goalId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${goalId}`, {
      headers: this.getAuthHeaders()
    });
  }

  addToSavings(goalId: number, amount: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/addtosavings/${goalId}`, amount, {
      headers: this.getAuthHeaders()
    });
  }
  
}
