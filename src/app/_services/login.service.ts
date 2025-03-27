import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private apiUrl = 'http://localhost:8080/clm/v1/user'; // Corrected URL

    constructor(private http: HttpClient) {}

    loginUser(userData: any): Observable<any> { // Change userData type to any
        return this.http.post<any>(`${this.apiUrl}/login`, userData); // Corrected endpoint
    }

    verifyGoogleToken(googleToken: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { token: googleToken });
    }

    forgotPassword(email: { email: string }): Observable<any> {
        return this.http.post<any>(this.apiUrl, { action: 'forgot_password', email: email.email });
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { action: 'reset_password', token, newPassword });
    }
}