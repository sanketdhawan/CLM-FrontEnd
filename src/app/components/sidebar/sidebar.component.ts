import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { AuthService } from '../../_services/authentication.service';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) {
    addIcons({});
  }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }

  public appPages = [
    { title: 'Draft Contracts', url: '', icon: 'drafts' },
    { title: 'Create Contracts ', url: 'contracts', icon: 'note_add' },
    { title: 'Closed Contracts ', url: 'contracts', icon: 'mail_lock' },
    // { title: 'Our Services', url: 'our-services', icon: 'aperture-outline' },
  ];
}
