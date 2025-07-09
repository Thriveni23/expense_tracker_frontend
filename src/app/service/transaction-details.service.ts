import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction-details';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TransactionDetailsService {

  constructor(private httpclient:HttpClient) { }
  baseurl="http://localhost:5287/api/Transactions";

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  
  GetTransaction(): Observable<Transaction[]> {
    return this.httpclient.get<Transaction[]>(this.baseurl, {
      headers: this.getAuthHeaders()
    });
  }

  insertTransaction(transaction: Transaction): Observable<Transaction> {
    return this.httpclient.post<Transaction>(this.baseurl, transaction, {
      headers: this.getAuthHeaders()
      
    });
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.httpclient.put<Transaction>(`${this.baseurl}/${id}`, transaction, {
      headers: this.getAuthHeaders()
    });
  }

  deleteTransaction(id: number): Observable<any> {
    return this.httpclient.delete(`${this.baseurl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  
}
