import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ContractService } from 'src/app/_services/contracts.service';
import { GlobalAlertService } from 'src/app/_services/global-alert.service';
import { GlobalLoaderService } from 'src/app/_services/global-loader.service';

@Component({
  selector: 'app-closed-contract',
  templateUrl: './closed-contract.component.html',
  styleUrls: ['./closed-contract.component.scss'],
  imports: [CommonModule]
})
export class ClosedContractComponent implements OnInit {
  closedContracts: any[] = [];
  globalLoaderService = inject(GlobalLoaderService);
  globalAlertService = inject(GlobalAlertService);
  contractService = inject(ContractService);

  ngOnInit() {
    this.fetchClosedContracts();
    this.createSegments();
  }

  fetchClosedContracts() {
    this.globalLoaderService.showLoader();
    const userInfoString = localStorage.getItem('userInfo');
    const userId = userInfoString ? (JSON.parse(userInfoString)?.userid || '') : '';

    if (userId) {
      this.contractService.fetchContracts({ userid: userId }).subscribe({
        next: (response) => {
          this.globalLoaderService.hideLoader();
          this.closedContracts = response?.contracts.filter((contract: any) => contract.progress >= 100) || [];
          console.log('Closed Contracts:', this.closedContracts);
          if (this.closedContracts.length === 0) {
            this.globalAlertService.setMessage('No closed contracts found.', 'danger');
          }
        },
        error: (error) => {
          this.globalLoaderService.hideLoader();
          console.error('Error fetching closed contracts:', error);
          this.globalAlertService.setMessage('Error fetching closed contracts. Please try again.', 'danger');
        }
      });
    } else {
      this.globalLoaderService.hideLoader();
      console.warn('User ID not found in local storage.');
      this.globalAlertService.setMessage('Please log in to view closed contracts.', 'danger');
    }
  }


  segments: string[] = ['Prize A', 'Prize B', 'Try Again', 'Big Win!', 'Small Gift'];
  numSegments: number = this.segments.length;
  degreesPerSegment: number = 360 / this.numSegments;
  currentRotation: number = 0;
  isSpinning: boolean = false;
  result: string = '';
  private spinTimeout: any;

  // You can define an array of colors or use a function to generate them
  segmentColors: string[] = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];

  constructor() {}


  createSegments(): void {
    // No need to create elements dynamically in Angular's template
  }

  getSegmentStyle(index: number): any {
    const rotation = index * this.degreesPerSegment;
    const startAngle = rotation;
    const endAngle = rotation + this.degreesPerSegment;

    // Calculate points for the clip-path polygon
    const points = [
      '50% 50%',
      `${50 * Math.cos(this.toRadians(startAngle)) + 50}% ${50 * Math.sin(this.toRadians(startAngle)) + 50}%`,
      `${50 * Math.cos(this.toRadians(endAngle)) + 50}% ${50 * Math.sin(this.toRadians(endAngle)) + 50}%`,
    ];

    return {
      'background-color': this.segmentColors[index % this.segmentColors.length],
      'transform': `rotate(${rotation}deg)`,
      'clip-path': `polygon(${points.join(', ')})`,
    };
  }

  spin(): void {
    if (this.isSpinning) {
      return;
    }
    this.isSpinning = true;
    this.result = '';

    const randomSpin = 360 * 5 + Math.random() * 360;
    this.currentRotation += randomSpin;

    this.spinTimeout = setTimeout(() => {
      this.isSpinning = false;
      const finalRotation = this.currentRotation % 360;
      const winningSegmentIndex = Math.floor((360 - finalRotation) / this.degreesPerSegment) % this.numSegments;
      this.result = `Landed on: ${this.segments[winningSegmentIndex]}`;
      // Optionally, reset rotation without animation
      // this.currentRotation = finalRotation;
    }, 5000); // Match the CSS transition duration
  }

  toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }
}
