import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/_services/contracts.service';
import { GlobalAlertService } from 'src/app/_services/global-alert.service';
import { GlobalLoaderService } from 'src/app/_services/global-loader.service';

interface ContractDetails {
  mis01Model: any; // Adjust the type based on your actual API response
  contractResponse: any;
}

@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class EditContractComponent implements OnInit {
  editForm!: FormGroup;
  contractId: string | null = null;
  contractDetails: ContractDetails | null = null;
  globalLoaderService = inject(GlobalLoaderService);
  globalAlertService = inject(GlobalAlertService);
  contractService = inject(ContractService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.contractId = params.get('id');
      if (this.contractId) {
        this.loadContractDetails(this.contractId);
      } else {
        this.globalAlertService.setMessage('Contract ID not found in URL.', 'danger');
      }
    });

    this.editForm = this.fb.group({
    contractName: ['', Validators.required],
    contractFor: [''],
    pncdp: [''],
    pncrp: [''],
    pncdpCname: [''],
    pncrpCname: [''],
    pncdpCadd: [''],
    pncrpCadd: [''],
    pncdpCpan: [''],
    pncrpCpan: [''],
    pncdpP1: [''],
    pncrpP1: [''],
    pncdpP2: [''],
    pncrpP2: [''],
    pncdpP1pan: [''],
    pncrpP1pan: [''],
    pncdpP2pan: [''],
    pncrpP2pan: [''],
    recRpb: [''],
    recDpb: [''],
    recBusp: [''],
    tcDur: [''],
    obcBp: [''],
    rc: [''],
    nsc: [''],
    gc: [''],
    gcCountry: [''],
    gcCity: [''],
    sigDPName: [''],
    sigRPName: [''],
    sigDPDes: [''],
    sigRPDes: [''],
    miscDPADD: [''],
    miscRPADD: [''],
    miscDpATT: [''], // Updated casing
    miscRPATT: [''],
    dpNickName: [''], // Updated casing
    rpNickName: [''], // Updated casing
  });
  }

  loadContractDetails(id: string): void {
    this.globalLoaderService.showLoader();
    console.log('Fetching contract details for ID:', id);

    this.contractService.fetchContractDetails({ contractID: parseInt(this.contractId!, 10) }).subscribe({ // Changed 'contractId' to 'contractID'
      next: (data) => {
        console.log('Full API Response:', data);
        if (data && data.mis01Model) {
          console.log('mis01Model found:', data.mis01Model);
          this.contractDetails = data;
          this.populateForm(data.mis01Model);
        } else {
          console.log('mis01Model is null or undefined in the response.');
        }
        this.globalLoaderService.hideLoader();
      },
      error: (error) => {
        console.error('Error fetching contract details:', error);
        this.globalLoaderService.hideLoader();
        this.globalAlertService.setMessage('Error fetching contract details.', 'danger');
      },
    });
  }

  populateForm(model: any): void {
    console.log(model)
    this.editForm.patchValue(model);
  }

  saveToDraft(): void {
    if (this.contractId) {
      this.globalLoaderService.showLoader();
      const updatedData = {
        type: 'DRAFT',
        contractId: parseInt(this.contractId, 10),
        ...this.editForm.value,
      };

      this.contractService.updateContractDetails(updatedData).subscribe({
        next: (response) => {
          this.globalLoaderService.hideLoader();
          this.globalAlertService.setMessage('Contract details saved to draft.', 'success');
          //this.router.navigate(['/contracts']); // Or wherever you want to redirect
        },
        error: (error) => {
          this.globalLoaderService.hideLoader();
          this.globalAlertService.setMessage('Error saving contract to draft.', 'danger');
          console.error('Error saving contract to draft:', error);
        },
      });
    } else {
      this.globalAlertService.setMessage('Contract ID is missing, cannot save.', 'danger');
    }
  }

  onSubmit(): void {
    if (this.editForm.valid && this.contractId) {
      this.globalLoaderService.showLoader();
      const submitData = {
        type: 'SUBMIT',
        contractId: parseInt(this.contractId, 10),
        ...this.editForm.value,
      };
    console.log('Submitting data:', submitData); // Add this line

      this.contractService.submitContractDetails(submitData).subscribe({ // Use the new submit method
        next: (response) => {
          this.globalLoaderService.hideLoader();
          this.globalAlertService.setMessage('Contract details submitted successfully!', 'success');
          this.router.navigate(['/contracts']); // Redirect to the contracts list page
        },
        error: (error) => {
          this.globalLoaderService.hideLoader();
          this.globalAlertService.setMessage('Error submitting contract details.', 'danger');
          console.error('Error submitting contract details:', error);
        },
      });
    } else {
      this.globalAlertService.setMessage('Please correct the form errors before submitting.', 'danger');
    }
  }
}