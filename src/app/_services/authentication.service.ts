import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, tap, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'; // Import Router

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    private userInfoSubject = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient, private router: Router) {
        this.isAuthenticatedSubject.next(!!this.getToken()); // Initialize auth state
        this.loadUserInfoFromStorage();
    }

    setToken(token: string): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('jwtToken', token);
            this.isAuthenticatedSubject.next(true);
        }
    }

    getToken(): string | null {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('jwtToken');
        }
        return null;
    }

    clearToken(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('jwtToken');
            this.isAuthenticatedSubject.next(false);
            this.router.navigate(['/login']); // Redirect to login on logout
        }
    }

    // Simplified authentication check
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    isAuthenticated$(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    // New method for post-login actions
    postLoginActions(): void {
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['/']); // Redirect to home after login
    }
    getUserInfo$(): Observable<any> {
        return this.userInfoSubject.asObservable(); // For header to subscribe
    }


    setUserInfo(userDetails: any): void {
        localStorage.setItem('userInfo', JSON.stringify(userDetails)); // Store in localStorage
        this.userInfoSubject.next(userDetails);
    }

    private loadUserInfoFromStorage(): void {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                this.userInfoSubject.next(parsedUserInfo);
            } catch (error) {
                console.error('Error parsing stored user info:', error);
                localStorage.removeItem('userInfo'); // Clear if parsing fails
                this.userInfoSubject.next(null);
            }
        }
    }

}