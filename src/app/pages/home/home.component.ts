import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonSplitPane, IonSearchbar } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/_services/authentication.service';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { Platform } from '@ionic/angular';
import { LoginComponent } from "../../components/login/login.component";
import { LogoComponent } from "../../components/logo/logo.component";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonSearchbar,
    RouterOutlet,
    IonContent,
    IonHeader,
    IonMenu,
    IonTitle,
    IonToolbar,
    SidebarComponent,
    IonSplitPane,
    LogoComponent, HeaderComponent],
})
export class HomeComponent {
  
}
