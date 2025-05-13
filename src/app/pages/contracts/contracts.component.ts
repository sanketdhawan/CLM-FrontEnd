import { Component, OnInit, inject } from '@angular/core';
import { GlobalLoaderService } from '../../_services/global-loader.service';
import { GlobalAlertService } from '../../_services/global-alert.service';
import { CommonModule } from '@angular/common';
import { ContractService } from 'src/app/_services/contracts.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
  standalone: true,
  imports: [CommonModule,RouterLink],
})
export class ContractsComponent implements OnInit {
  contracts: any[] = [];
  globalLoaderService = inject(GlobalLoaderService);
  globalAlertService = inject(GlobalAlertService);
  contractService = inject(ContractService);

  ngOnInit() {
    this.fetchContractData();
  }

  fetchContractData() {
    this.globalLoaderService.showLoader();
    const userInfoString = localStorage.getItem('userInfo');
    const userId = userInfoString ? (JSON.parse(userInfoString)?.userid || '') : '';

    if (userId) {
      this.contractService.fetchContracts({ userid: userId }).subscribe({
        next: (response) => {
          this.globalLoaderService.hideLoader();
          // Filter out completed contracts and sort by creation date (newest first)
          this.contracts = response?.contracts
            ?.filter((contract: any) => contract.progress < 100)
            .sort((a: any, b: any) => new Date(b.crtDate).getTime() - new Date(a.crtDate).getTime()) || [];
          console.log('Fetched Contracts:', this.contracts);
          if (this.contracts.length === 0) {
            this.globalAlertService.setMessage('No contracts found.', 'danger');
          }
        },
        error: (error) => {
          this.globalLoaderService.hideLoader();
          console.error('Error fetching contracts:', error);
          this.globalAlertService.setMessage('Error fetching contracts. Please try again.', 'danger');
        },
      });
    } else {
      this.globalLoaderService.hideLoader();
      console.warn('User ID not found in local storage.');
      this.globalAlertService.setMessage('Please log in to view contracts.', 'danger');
    }
  }

  getContractStatus(progress: number): string {
    if (progress < 15) {
      return 'Draft';
    } else if (progress >= 100) {
      return 'Completed';
    } else {
      return 'In Progress';
    }
  }

  editContract(contractId: number) {
    console.log(`Edit contract with ID: ${contractId}`);
  }
}