import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private base = environment.authApi;

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { username: string; password: string; role: string; phone: number }) {
    return this.http.post(`${this.base}/register`, data);
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string; role: string }>(`${this.base}/login`, credentials);
  }

  saveSession(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role',  role);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getRole(): string     { return localStorage.getItem('role')  || ''; }
  isLoggedIn(): boolean { return !!localStorage.getItem('token'); }

  getProfile() {
    return this.http.get<any>(`${this.base}/profile`);
  }

  updateProfile(data: { phone?: number; password?: string }) {
    return this.http.put(`${this.base}/profile/update`, data);
  }
}