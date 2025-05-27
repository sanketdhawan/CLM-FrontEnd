import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core'; // Add OnDestroy
import { SafeHtml } from '@angular/platform-browser'; // Import SafeHtml

import { Subscription } from 'rxjs'; // Import Subscription
import { GlobalAlertService } from 'src/app/_services/global-alert.service';

@Component({
  selector: 'app-global-alert',
  templateUrl: './global-alert.angular.html',
  styleUrls: ['./global-alert.angular.scss'],
  imports:[CommonModule],
  standalone: true,
})
export class GlobalAlertAngular implements OnInit, OnDestroy { // Implement OnDestroy
  // Change the Input message type to SafeHtml | string
  @Input() message: SafeHtml | string = '';
  @Input() type: 'success' | 'danger' = 'success';

  private alertService = inject(GlobalAlertService); // Inject the service
  private subscription!: Subscription; // Declare a subscription to manage cleanup

  ngOnInit() {
    // Subscribe to the alert service to get messages
    this.subscription = this.alertService.getMessage().subscribe(alert => {
      this.message = alert.message;
      this.type = alert.type;
      if (this.message) {
        setTimeout(() => this.clearMessage(), 5000); // Automatically clear message after 5 seconds
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  clearMessage() {
    this.alertService.clearMessage(); // Clear message via service
  }
}