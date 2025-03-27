import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../_services/authentication.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ReverseAuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.authService.isAuthenticated$().pipe(
            map((isAuthenticated) => {
                if (isAuthenticated) {
                    this.router.navigate(['/']); // Redirect to home if authenticated
                    return false;
                } else {
                    return true;
                }
            })
        );
    }
}