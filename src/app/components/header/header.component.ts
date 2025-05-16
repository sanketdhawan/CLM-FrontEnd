import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonMenuToggle } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/_services/authentication.service';
import { UpdatePasswordComponent } from 'src/app/pages/update-password/update-password.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonMenuToggle, RouterLink],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router) {}
  randomColor: string = '#000000';
  userInfoSubscription: Subscription | undefined;
  userData: any;
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.randomColor = this.generateDarkColor();

    this.userInfoSubscription = this.authService
      .getUserInfo$()
      .subscribe((data) => {
        this.userData = data;
        this.checkFirstLogin(); // Check first login flag after user data is available
      });
  }

  ngOnDestroy(): void {
    this.userInfoSubscription?.unsubscribe();
  }

  checkFirstLogin(): void {
    const storedUserData = localStorage.getItem('userInfo');
    if (storedUserData) {
      const userInfo = JSON.parse(storedUserData);
      if (userInfo.firstLoginFlag === 'Y') {
        this.openUpdatePasswordModal(true); // Open modal with backdrop and keyboard disabled
      }
    }
  }

  updatePasswordModel() {
    this.openUpdatePasswordModal(false); // Open modal normally if triggered from UI
  }

  openUpdatePasswordModal(preventClose: boolean = false) {
    const modalRef = this.modalService.open(UpdatePasswordComponent, {
      centered: true,
      backdrop: 'static', // Force static backdrop here
      keyboard: false,   // Force keyboard to false here
    });
    modalRef.componentInstance.userData = this.userData;
    modalRef.componentInstance.isFirstLogin = preventClose; // Pass the flag for conditional close button
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