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
}
