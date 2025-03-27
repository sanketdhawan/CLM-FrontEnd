import { Component } from '@angular/core';
import { GlobalAlertService } from './_services/global-alert.service';
import { GlobalLoaderService } from './_services/global-loader.service';
import { GlobalLoaderComponent } from './components/globalloader/globalloader.angular';
import { GlobalAlertAngular } from './components/global-alert/global-alert.angular';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [GlobalLoaderComponent, GlobalAlertAngular, RouterOutlet],
})
export class AppComponent {
  globalMessage: string = '';
  globalType: 'success' | 'danger' = 'success';

  constructor(
    private globalAlertService: GlobalAlertService,
    private globalLoaderService: GlobalLoaderService
  ) { }

  ngOnInit() {
    this.globalAlertService.getMessage().subscribe((alert) => {
      this.globalMessage = alert.message;
      this.globalType = alert.type;
      if (this.globalMessage) {
        setTimeout(() => this.globalAlertService.clearMessage(), 5000); // Automatically clear message after 5 seconds
      }
    });
  }

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
