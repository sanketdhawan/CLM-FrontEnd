import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { GlobalAlertService } from './_services/global-alert.service';
import { GlobalLoaderService } from './_services/global-loader.service';
import { GlobalLoaderComponent } from './components/globalloader/globalloader.angular';
import { GlobalAlertAngular } from './components/global-alert/global-alert.angular';
import { RouterOutlet } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser'; // Import SafeHtml
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [GlobalLoaderComponent, GlobalAlertAngular, RouterOutlet],
  standalone: true, // Assuming your app.component is standalone based on imports array
})
export class AppComponent implements OnInit, OnDestroy { // Implement OnInit and OnDestroy
  // Change the type of globalMessage to SafeHtml | string
  globalMessage: SafeHtml | string = '';
  globalType: 'success' | 'danger' = 'success';

  private globalAlertService = inject(GlobalAlertService); // Use inject for consistency
  private globalLoaderService = inject(GlobalLoaderService); // Use inject for consistency
  private subscription!: Subscription; // To manage the subscription

  constructor() { } // Constructor can be empty if using inject

  ngOnInit() {
    this.subscription = this.globalAlertService.getMessage().subscribe((alert) => {
      this.globalMessage = alert.message;
      this.globalType = alert.type;
      // The GlobalAlertAngular component already handles the setTimeout for clearing.
      // So you can remove this timeout from here if GlobalAlertAngular is always used.
      // If globalMessage is also displayed directly in app.component.html, then keep this.
      if (this.globalMessage) {
        setTimeout(() => this.globalAlertService.clearMessage(), 5000);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // If you call these directly from app.component.html
  setGlobalAlert(message: string, type: 'success' | 'danger') {
    this.globalAlertService.setMessage(message, type);
  }

  showLoader() {
    this.globalLoaderService.showLoader();
  }

  hideLoader() {
    this.globalLoaderService.hideLoader();
  }
}