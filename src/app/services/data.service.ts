import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Category, Transaction, HSRStation } from '../models/data-item';

@Injectable({
 providedIn: 'root'
})
export class DataService {
 private baseUrl = 'http://localhost:8080/api';

 constructor(private http: HttpClient) { }

 // 獲取類別列表
 getCategories(): Observable<Category[]> {
   console.log('Fetching categories...');
   return this.http.get<Category[]>(`${this.baseUrl}/categories`).pipe(
     tap(data => console.log('Categories response:', data)),
     catchError(error => {
       console.error('Error fetching categories:', error);
       return throwError(() => error);
     })
   );
 }

 // 獲取交易列表
 getTransactions(): Observable<Transaction[]> {
   console.log('Fetching transactions...');
   return this.http.get<Transaction[]>(`${this.baseUrl}/transactions`).pipe(
     tap(data => console.log('Transactions response:', data)),
     catchError(error => {
       console.error('Error fetching transactions:', error);
       return throwError(() => error);
     })
   );
 }

 // 獲取高鐵站別列表
 getHSRStations(): Observable<HSRStation[]> {
   console.log('Fetching HSR stations...');
   return this.http.get<HSRStation[]>(`${this.baseUrl}/hsr`).pipe(
     tap(data => console.log('HSR response:', data)),
     catchError(error => {
       console.error('Error fetching HSR stations:', error);
       return throwError(() => error);
     })
   );
 }

 // 新增類別
 addCategory(category: Category): Observable<Category> {
   console.log('Adding category:', category);
   return this.http.post<Category>(`${this.baseUrl}/categories`, category).pipe(
     tap(data => console.log('Add category response:', data)),
     catchError(error => {
       console.error('Error adding category:', error);
       return throwError(() => error);
     })
   );
 }

 // 新增交易
 addTransaction(transaction: Transaction): Observable<Transaction> {
   console.log('Adding transaction:', transaction);
   return this.http.post<Transaction>(`${this.baseUrl}/transactions`, transaction).pipe(
     tap(data => console.log('Add transaction response:', data)),
     catchError(error => {
       console.error('Error adding transaction:', error);
       return throwError(() => error);
     })
   );
 }

 // 新增高鐵站別
 addHSRStation(station: HSRStation): Observable<HSRStation> {
   console.log('Adding HSR station:', station);
   return this.http.post<HSRStation>(`${this.baseUrl}/hsr`, station).pipe(
     tap(data => console.log('Add HSR station response:', data)),
     catchError(error => {
       console.error('Error adding HSR station:', error);
       return throwError(() => error);
     })
   );
 }

 // 更新類別
 updateCategory(id: string, category: Category): Observable<Category> {
   console.log('Updating category:', category);
   return this.http.put<Category>(`${this.baseUrl}/categories/${id}`, category).pipe(
     tap(data => console.log('Update category response:', data)),
     catchError(error => {
       console.error('Error updating category:', error);
       return throwError(() => error);
     })
   );
 }

 // 更新交易
 updateTransaction(id: string, transaction: Transaction): Observable<Transaction> {
   console.log('Updating transaction:', transaction);
   return this.http.put<Transaction>(`${this.baseUrl}/transactions/${id}`, transaction).pipe(
     tap(data => console.log('Update transaction response:', data)),
     catchError(error => {
       console.error('Error updating transaction:', error);
       return throwError(() => error);
     })
   );
 }

 // 更新高鐵站別
 updateHSRStation(id: string, station: HSRStation): Observable<HSRStation> {
   console.log('Updating HSR station:', station);
   return this.http.put<HSRStation>(`${this.baseUrl}/hsr/${id}`, station).pipe(
     tap(data => console.log('Update HSR station response:', data)),
     catchError(error => {
       console.error('Error updating HSR station:', error);
       return throwError(() => error);
     })
   );
 }

 // 刪除類別
 deleteCategory(id: string): Observable<void> {
   console.log('Deleting category:', id);
   return this.http.delete<void>(`${this.baseUrl}/categories/${id}`).pipe(
     tap(() => console.log('Category deleted successfully')),
     catchError(error => {
       console.error('Error deleting category:', error);
       return throwError(() => error);
     })
   );
 }

 // 刪除交易
 deleteTransaction(id: string): Observable<void> {
  console.log('開始刪除交易，ID:', id);
  return this.http.delete<void>(`${this.baseUrl}/transactions/${id}`).pipe(
    tap(() => console.log('成功刪除交易')),
    catchError(error => {
      console.error('刪除交易時發生錯誤:', error);
      return throwError(() => error);
    })
  );
}

 // 刪除高鐵站別
 deleteHSRStation(id: string): Observable<void> {
   console.log('Deleting HSR station:', id);
   return this.http.delete<void>(`${this.baseUrl}/hsr/${id}`).pipe(
     tap(() => console.log('HSR station deleted successfully')),
     catchError(error => {
       console.error('Error deleting HSR station:', error);
       return throwError(() => error);
     })
   );
 }

 // 根據ID獲取類別
 getCategoryById(id: string): Observable<Category> {
   console.log('Fetching category by id:', id);
   return this.http.get<Category>(`${this.baseUrl}/categories/${id}`).pipe(
     tap(data => console.log('Category by id response:', data)),
     catchError(error => {
       console.error('Error fetching category by id:', error);
       return throwError(() => error);
     })
   );
 }

 // 根據ID獲取交易
 getTransactionById(id: string): Observable<Transaction> {
   console.log('Fetching transaction by id:', id);
   return this.http.get<Transaction>(`${this.baseUrl}/transactions/${id}`).pipe(
     tap(data => console.log('Transaction by id response:', data)),
     catchError(error => {
       console.error('Error fetching transaction by id:', error);
       return throwError(() => error);
     })
   );
 }

 // 根據ID獲取高鐵站別
 getHSRStationById(id: string): Observable<HSRStation> {
   console.log('Fetching HSR station by id:', id);
   return this.http.get<HSRStation>(`${this.baseUrl}/hsr/${id}`).pipe(
     tap(data => console.log('HSR station by id response:', data)),
     catchError(error => {
       console.error('Error fetching HSR station by id:', error);
       return throwError(() => error);
     })
   );
 }
}