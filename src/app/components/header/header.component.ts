import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonMenuToggle } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonMenuToggle, RouterLink],
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
