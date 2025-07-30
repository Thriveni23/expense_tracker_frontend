import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction-details';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TransactionDetailsService {

  constructor(private httpclient:HttpClient) { }
  baseurl="http://localhost:5287/api/Transactions";

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  
 GetTransaction(): Observable<Transaction[]> {
  return this.httpclient.get<any>(this.baseurl, {
    headers: this.getAuthHeaders()
  }).pipe(
    map(response => response.result) // ✅ Extract only the result array
  );
}

 insertTransaction(transaction: Transaction): Observable<Transaction> {
  return this.httpclient.post<any>(this.baseurl, transaction, {
    headers: this.getAuthHeaders()
  }).pipe(
    map(response => response.result) // ✅ Return the actual transaction object
  );
}

updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
  return this.httpclient.put<any>(`${this.baseurl}/${id}`, transaction, {
    headers: this.getAuthHeaders()
  }).pipe(
    map(response => response.result)
  );
}


  deleteTransaction(id: number): Observable<any> {
    return this.httpclient.delete(`${this.baseurl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  
}
