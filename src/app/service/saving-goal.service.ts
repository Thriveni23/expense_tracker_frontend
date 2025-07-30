import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SavingGoal } from '../models/savings-goals';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SavingGoalService {
  private baseUrl = 'http://localhost:5287/api/SavingGoals';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
     const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addGoal(goal: SavingGoal): Observable<SavingGoal> {
    return this.http.post<any>(this.baseUrl, goal, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ extract the actual SavingGoal object
    );
  }


  getGoals(): Observable<SavingGoal[]> {
    return this.http.get<any>(this.baseUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ extract the array of goals
    );
  }

  deleteGoal(goalId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${goalId}`, {
      headers: this.getAuthHeaders()
    });
  }

addToSavings(goalId: number, amount: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/addtosavings/${goalId}`, amount, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.result) // ✅ extract updated goal object
    );
  }
  
}
