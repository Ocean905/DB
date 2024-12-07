// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Transaction, HSRStation } from '../models/data-item';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // 獲取類別列表
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/invoice_transtions_categories`);
  }

  // 獲取交易列表
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/invoice_transactions`);
  }

  // 獲取高鐵站別列表
  getHSRStations(): Observable<HSRStation[]> {
    return this.http.get<HSRStation[]>(`${this.baseUrl}/HSR`);
  }

  // 新增類別
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/invoice_transtions_categories`, category);
  }

  // 新增交易
  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/invoice_transactions`, transaction);
  }

  // 新增高鐵站別
  addHSRStation(station: HSRStation): Observable<HSRStation> {
    return this.http.post<HSRStation>(`${this.baseUrl}/HSR`, station);
  }

  // 刪除類別
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/invoice_transtions_categories/${id}`);
  }

  // 刪除交易
  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/invoice_transactions/${id}`);
  }

  // 刪除高鐵站別
  deleteHSRStation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/HSR/${id}`);
  }
}