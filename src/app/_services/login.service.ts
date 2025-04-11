import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    // private apiUrl = `${environment.endpoint}clm/v1/user`; // Corrected URL

    private apiUrl = "https://147.93.29.157/api";
    constructor(private http: HttpClient) {}

    loginUser(userData: any): Observable<any> { // Change userData type to any
        return this.http.post<any>(`${this.apiUrl}/login`, userData); // Corrected endpoint
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