import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // private apiUrl = `${environment.endpoint}clm/v1/user`; // Corrected URL
  // https://api.auctapace.com/clm/v1/user/login
  private apiUrl = 'https://api.auctapace.com/clm/v1/user';
  constructor(private http: HttpClient) {}

  loginUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }

  forgotPassword(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, userData);
  }

  updatePassword(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-password`, userData);
  }
  
}
