import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    // private apiUrl = `${environment.endpoint}clm/v1/user`; // Corrected URL
    // https://api.auctapace.com/clm/v1/user/login
    private apiUrl = "https://api.auctapace.com/clm/v1/user";
    constructor(private http: HttpClient) {}

    loginUser(userData: any): Observable<any> { // Change userData type to any
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post<any>(`${this.apiUrl}/login`, userData, { headers, withCredentials: false }); // Corrected endpoint
    }

    verifyGoogleToken(googleToken: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { token: googleToken });
    }

    forgotPassword(email: { email: string }): Observable<any> {
        return this.http.post<any>(this.apiUrl, { action: 'forgot-password', email: email.email });
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { action: 'reset_password', token, newPassword });
    }
}