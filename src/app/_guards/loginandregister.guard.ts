import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/authentication.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginRegisterGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$().pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['/products']);
          return false;
        }
      })
    );
  }
}
