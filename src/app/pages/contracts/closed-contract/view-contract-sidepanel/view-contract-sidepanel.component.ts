import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ContractService } from 'src/app/_services/contracts.service';


@Component({
  selector: 'app-view-contract-sidepanel',
  templateUrl: './view-contract-sidepanel.component.html',
  styleUrls: ['./view-contract-sidepanel.component.scss']
})
export class ViewContractSidepanelComponent implements OnInit {
  @Input() contractId: string | null = null;
  @Output() closePanel = new EventEmitter<void>();
  contractDetails: any;
  isLoading = true;
  errorMessage: string = '';

  constructor(private contractService: ContractService) { }

  ngOnInit(): void {
    if (this.contractId) {
     // this.loadContractDetails(this.contractId);
    } else {
      this.errorMessage = 'Contract ID is missing.';
      this.isLoading = false;
    }
  }

  // loadContractDetails(id: string): void {
  //   this.isLoading = true;
  //   this.contractService.getContractById(id).subscribe(
  //     (data) => {
  //       this.contractDetails = data;
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       console.error('Error loading contract:', error);
  //       this.errorMessage = 'Failed to load contract details.';
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // onClose(): void {
  //   this.closePanel.emit();
  // }
}