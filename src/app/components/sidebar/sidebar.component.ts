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
    { title: 'Our Services', url: 'our-services', icon: 'aperture-outline' },

    // { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    // { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
}
