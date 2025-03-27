import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-global-alert',
  templateUrl: './global-alert.angular.html',
  styleUrls: ['./global-alert.angular.scss'],
  imports:[CommonModule],
  standalone: true,
})
export class GlobalAlertAngular implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'danger' = 'success';

  ngOnInit() {
    if (this.message) {
      setTimeout(() => this.clearMessage(), 5000); // Automatically clear message after 5 seconds
    }
  }

  clearMessage() {
    this.message = '';
  }
}
