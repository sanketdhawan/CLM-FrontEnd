import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonSplitPane
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/_services/authentication.service';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    IonContent,
    IonHeader,
    IonMenu,
    IonTitle,
    IonToolbar,
    SidebarComponent,
    IonSplitPane
  ],
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router,private platform: Platform) { }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }



  // public async addNewToGallery() {
  //   if (this.platform.is('hybrid')) {
  //     // Use Capacitor Camera plugin for mobile devices
  //     const capturedPhoto = await Camera.getPhoto({
  //       resultType: CameraResultType.Uri,
  //       source: CameraSource.Camera,
  //       quality: 100,
  //     });

  //     this.photos.push(capturedPhoto);
  //   } else {
  //     // Use a fallback for web
  //     this.addWebPhoto();
  //   }
  // }

  // private addWebPhoto() {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = 'image/*';
  //   input.onchange = (event: any) => {
  //     const file = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const webPhoto: Photo = {
  //         webPath: reader.result as string,
  //         format: 'jpeg',
  //       };
  //       this.photos.push(webPhoto);
  //     };
  //     reader.readAsDataURL(file);
  //   };
  //   input.click();
  // }

  ngOnInit() { }
}
