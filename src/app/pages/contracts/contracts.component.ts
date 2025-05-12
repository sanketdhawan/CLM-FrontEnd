import { Component, OnInit, inject } from '@angular/core';
import { GlobalLoaderService } from '../../_services/global-loader.service';
import { GlobalAlertService } from '../../_services/global-alert.service';
import { CommonModule } from '@angular/common'; // Import CommonModule for date pipe
import { ContractService } from 'src/app/_services/contracts.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
  standalone: true,
  imports: [CommonModule], // Import CommonModule to use date pipe
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
          this.contracts = response?.contracts || []; // Access the 'contracts' array
          console.log('Fetched Contracts:', this.contracts);
          if (this.contracts.length === 0) {
            this.globalAlertService.setMessage('No contracts found.', 'danger');
          }
        },
        error: (error) => {
          this.globalLoaderService.hideLoader();
          console.error('Error fetching contracts:', error);
          this.globalAlertService.setMessage('Error fetching contracts. Please try again.', 'danger');
        }
      });
    } else {
      this.globalLoaderService.hideLoader();
      console.warn('User ID not found in local storage.');
      this.globalAlertService.setMessage('Please log in to view contracts.', 'danger');
      // Optionally redirect to login
    }
  }

getContractStatus(progress: number): string {
  if (progress < 15) {
    return 'Draft'; 
  } else if (progress >= 100) {
    return 'Completed';
  } else {
    return 'In Progress'; // Ensure this matches exactly in the template
  }
}


  // Placeholder for the edit functionality
  editContract(contractId: number) {
    console.log(`Edit contract with ID: ${contractId}`);
    // Here you would likely navigate to an edit page or trigger a modal
    // and potentially call a service to fetch the contract details.
  }
}