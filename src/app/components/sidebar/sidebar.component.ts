import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { AuthService } from '../../_services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterLink, IonIcon, IonLabel, IonItem],
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }

  public appPages = [
    { title: 'Dashboard', url: '', icon: 'aperture-outline' },
    // { title: 'Our Services', url: 'our-services', icon: 'aperture-outline' },
  ];
}
