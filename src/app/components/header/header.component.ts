import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}
  randomColor: string = '#000000';
  userInfoSubscription: Subscription | undefined;
  userData: any;

  ngOnInit(): void {
    this.randomColor = this.generateDarkColor();

    this.userInfoSubscription = this.authService
      .getUserInfo$()
      .subscribe((data) => {
        this.userData = data; // Now you have it!
        // console.log('DashboardComponent: User Data:', this.userData);
      });
  }

  ngOnDestroy(): void {
    this.userInfoSubscription?.unsubscribe();
  }

  generateDarkColor(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70;
    const lightness = Math.floor(Math.random() * 30) + 20;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
