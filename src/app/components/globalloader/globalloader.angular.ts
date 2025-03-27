import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GlobalLoaderService } from 'src/app/_services/global-loader.service';

@Component({
  selector: 'app-global-loader',
  templateUrl: './globalloader.angular.html',
  styleUrls: ['./globalloader.angular.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true,
})
export class GlobalLoaderComponent {
  isLoading$ = this.globalLoaderService.isLoading();

  constructor(private globalLoaderService: GlobalLoaderService) {}
}
