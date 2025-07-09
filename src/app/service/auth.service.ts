import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5287/api/Auth';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('role', res.role);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const payload = { currentPassword, newPassword };
    return this.http.post(`${this.apiUrl}/ChangePassword`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteAccount`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllUsers(): Observable<any> {
    console.log('Token sent:', this.getAuthHeaders().get('Authorization'));
    return this.http.get(`${this.apiUrl}/all-users`, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-user/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
