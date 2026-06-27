import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private base = environment.bookingApi;
  constructor(private http: HttpClient) {}
  getOwnerHistory() { return this.http.get<any[]>(`${this.base}/booking/owner/history`); }
  getCustomerHistory() { return this.http.get<any[]>(`${this.base}/booking/customer/history`); }
}