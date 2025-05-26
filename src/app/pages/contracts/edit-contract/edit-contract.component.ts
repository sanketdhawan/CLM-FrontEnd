import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContractService } from 'src/app/_services/contracts.service';
import { GlobalAlertService } from 'src/app/_services/global-alert.service';
import { GlobalLoaderService } from 'src/app/_services/global-loader.service';
import { HttpErrorResponse } from '@angular/common/http';

interface ContractDetails {
  mis01Model: any;
  contractResponse: any;
}

interface DropdownOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
})
export class EditContractComponent implements OnInit, OnDestroy, AfterViewInit {
  editForm!: FormGroup;
  contractId: string | null = null;
  contractDetails: ContractDetails | null = null;
  contractNotFound: boolean = false;
  globalLoaderService = inject(GlobalLoaderService);
  globalAlertService = inject(GlobalAlertService);
  contractService = inject(ContractService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  private fb = inject(FormBuilder);

  activeTabId: string = 'parties'; // Default active tab

  private currentUserInfo: { userId?: string } | null = null;
  private readonly LOCAL_STORAGE_KEY_PREFIX = 'contractEditTab_';

  contractForOptions: DropdownOption[] = [
    { value: '1', label: 'Mutual NDA' },
    { value: '2', label: 'Disclosing Party NDA' },
    { value: '3', label: 'Recipient Party NDA' },
  ];

  pncdpOptions: DropdownOption[] = [
    { value: '1', label: 'Standard' },
    { value: '2', label: 'Company' },
    { value: '3', label: 'Partnership' },
    { value: '4', label: 'LLP' },
    { value: '5', label: 'Individual' },
  ];

  pncrpOptions: DropdownOption[] = [
    { value: '1', label: 'Standard' },
    { value: '2', label: 'Company' },
    { value: '3', label: 'Partnership' },
    { value: '4', label: 'LLP' },
    { value: '5', label: 'Individual' },
  ];

  rcOptions: DropdownOption[] = [
    { value: '1', label: 'With Aggregate Liability' },
    { value: '2', label: 'Without Aggregate Liability' },
  ];

  gcOptions: DropdownOption[] = [
    { value: '1', label: 'Governing Law - Standard' },
    { value: '2', label: 'Governing Law - Without Arbitration' },
    { value: '3', label: 'Foreign Law Standard' },
    { value: '4', label: 'Foreign Law - Without Arbitration' },
  ];

  ngOnInit(): void {
    try {
      const userInfoString = localStorage.getItem('userinfo');
      if (userInfoString) {
        this.currentUserInfo = JSON.parse(userInfoString);
      }
    } catch (e) {
      console.error('Error parsing userinfo from localStorage', e);
      this.currentUserInfo = null;
    }

    this.route.paramMap.subscribe((params) => {
      this.contractId = params.get('id');
      if (this.contractId) {
        this.loadContractDetails(this.contractId);
      } else {
        this.globalAlertService.setMessage('Contract ID not found in URL.', 'danger');
        this.contractNotFound = true;
      }
    });

    this.editForm = this.fb.group({
      contractName: ['', [Validators.required, Validators.minLength(3)]],
      contractFor: ['', Validators.required],
      pncdp: ['', Validators.required],
      pncrp: ['', Validators.required],
      pncdpCname: ['', [Validators.required, Validators.minLength(3)]],
      pncrpCname: ['', [Validators.required, Validators.minLength(3)]],
      pncdpCadd: ['', [Validators.required, Validators.minLength(3)]],
      pncrpCadd: ['', [Validators.required, Validators.minLength(3)]],
      pncdpCpan: ['', [Validators.required, Validators.minLength(3)]],
      pncrpCpan: ['', [Validators.required, Validators.minLength(3)]],
      pncdpP1: ['', [Validators.required, Validators.minLength(3)]],
      pncrpP1: ['', [Validators.required, Validators.minLength(3)]],
      pncdpP2: ['', Validators.minLength(3)],
      pncrpP2: ['', Validators.minLength(3)],
      pncdpP1pan: ['', [Validators.required, Validators.minLength(3)]],
      pncrpP1pan: ['', [Validators.required, Validators.minLength(3)]],
      pncdpP2pan: ['', Validators.minLength(3)],
      pncrpP2pan: ['', Validators.minLength(3)],
      recRpb: ['', [Validators.required, Validators.minLength(3)]],
      recDpb: ['', [Validators.required, Validators.minLength(3)]],
      recBusp: ['', [Validators.required, Validators.minLength(3)]],
      tcDur: ['', [Validators.required, Validators.minLength(3)]],
      obcBp: ['', Validators.minLength(3)],
      rc: ['', Validators.required],
      nsc: [false],
      gc: ['', Validators.required],
      gcCountry: ['', [Validators.required, Validators.minLength(3)]],
      gcCity: ['', [Validators.required, Validators.minLength(3)]],
      sigDPName: ['', [Validators.required, Validators.minLength(3)]],
      sigRPName: ['', [Validators.required, Validators.minLength(3)]],
      sigDPDes: ['', [Validators.required, Validators.minLength(3)]],
      sigRPDes: ['', [Validators.required, Validators.minLength(3)]],
      miscDPADD: ['', [Validators.required, Validators.minLength(3)]],
      miscRPADD: ['', [Validators.required, Validators.minLength(3)]],
      miscDpATT: ['', [Validators.required, Validators.minLength(3)]],
      miscRPATT: ['', [Validators.required, Validators.minLength(3)]],
      dpNickname: ['', [Validators.required, Validators.minLength(3)]],
      rpNickname: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.activeTabId = this.loadActiveTab();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.activateTab(this.activeTabId);
    }, 0);
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed
  }

  loadContractDetails(id: string): void {
    this.globalLoaderService.showLoader();
    this.contractNotFound = false;

    this.contractService.fetchContractDetails({ contractID: parseInt(this.contractId!, 10) }).subscribe({
      next: (data) => {
        if (data && data.mis01Model) {
          this.contractDetails = data;
          this.populateForm(data.mis01Model);
        } else {
          this.globalAlertService.setMessage('Contract details could not be loaded or were empty.', 'danger');
          this.contractNotFound = true;
        }
        this.globalLoaderService.hideLoader();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching contract details:', error);
        this.globalLoaderService.hideLoader();
        this.globalAlertService.setMessage('Error fetching contract details. Please check the ID.', 'danger');
        this.contractNotFound = true;
      },
    });
  }

  populateForm(model: any): void {
    const formValue = {
      ...model,
      nsc: model.nsc === 1 ? true : false,
      dpNickname: model.dpNickName || '',
      rpNickname: model.rpNickName || '',
      miscDpATT: model.miscDpATT || model.miscDPATT || model.miscDpAtt || ''
    };
    this.editForm.patchValue(formValue);
  }

  private cleanFormData(formData: any): any {
    const cleanedData: { [key: string]: any } = {};
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        let value = formData[key];
        if (value === null || typeof value === 'undefined') {
          cleanedData[key] = '';
        } else if (typeof value === 'boolean') {
          cleanedData[key] = value ? 1 : 0;
        } else {
          cleanedData[key] = value;
        }
      }
    }
    cleanedData['dpNickName'] = formData.dpNickname;
    cleanedData['rpNickName'] = formData.rpNickname;
    delete cleanedData['dpNickname'];
    delete cleanedData['rpNickname'];

    return cleanedData;
  }

  saveToDraft(): void {
    if (this.contractId && !this.contractNotFound) {
      this.globalLoaderService.showLoader();
      const rawFormData = this.editForm.value;
      const updatedData = {
        type: 'DRAFT',
        contractId: parseInt(this.contractId, 10),
        ...this.cleanFormData(rawFormData),
      };

      this.contractService.updateContractDetails(updatedData).subscribe({
        next: (response) => {
          this.globalLoaderService.hideLoader();
          this.globalAlertService.setMessage('Contract details saved to draft.', 'success');
        },
        error: (error) => {
          console.error('Error saving contract to draft:', error);
          this.globalLoaderService.hideLoader();
          this.globalAlertService.setMessage('Error saving contract to draft.', 'danger');
        },
      });
    } else if (this.contractNotFound) {
      this.globalAlertService.setMessage('Cannot save: No contract found with this ID.', 'danger');
    } else {
      this.globalAlertService.setMessage('Contract ID is missing, cannot save.', 'danger');
    }
  }

  onSubmit(): void {
    this.editForm.markAllAsTouched();

    if (this.editForm.valid && this.contractId && !this.contractNotFound) {
      this.globalLoaderService.showLoader();
      const rawFormData = this.editForm.value;
      const submitData = {
        type: 'SUBMIT',
        contractId: parseInt(this.contractId, 10),
        ...this.cleanFormData(rawFormData),
      };

      this.contractService.submitContractDetails(submitData).subscribe({
        next: (response) => {
          this.globalLoaderService.hideLoader();
          this.globalAlertService.setMessage(response.message || 'Contract submitted successfully.', 'success');
          this.router.navigate(['/contracts/closed']);
        },
        error: (error) => {
          console.error('Error submitting contract details:', error);
          this.globalLoaderService.hideLoader();
          this.globalAlertService.setMessage(error.message || 'Error submitting contract details.', 'danger');
        },
      });
    } else if (this.contractNotFound) {
      this.globalAlertService.setMessage('Cannot submit: No contract found with this ID.', 'danger');
    } else {
      this.globalAlertService.setMessage('Please correct the form errors before submitting.', 'danger');
    }
  }

  isLastTab(tabId: string): boolean {
    return tabId === 'signatory';
  }

  onTabClick(event: Event, tabId: string): void {
    event.preventDefault();
    this.activeTabId = tabId;
    this.saveActiveTab(tabId);
    this.activateTab(tabId);
  }

  private saveActiveTab(tabId: string): void {
    if (this.currentUserInfo?.userId) {
      localStorage.setItem(this.LOCAL_STORAGE_KEY_PREFIX + this.currentUserInfo.userId, tabId);
    } else {
      localStorage.setItem(this.LOCAL_STORAGE_KEY_PREFIX + 'guest', tabId);
    }
  }

  private loadActiveTab(): string {
    let storedTabId: string | null = null;
    if (this.currentUserInfo?.userId) {
      storedTabId = localStorage.getItem(this.LOCAL_STORAGE_KEY_PREFIX + this.currentUserInfo.userId);
    } else {
      storedTabId = localStorage.getItem(this.LOCAL_STORAGE_KEY_PREFIX + 'guest');
    }
    return storedTabId || 'parties';
  }

  private activateTab(tabId: string): void {
    const tabElement = document.querySelector(`a[href="#${tabId}"]`) as HTMLElement;
    if (tabElement) {
      // Ensure Bootstrap JS is loaded and accessible
      const bsTab = (window as any).bootstrap?.Tab;
      if (bsTab) {
        new bsTab(tabElement).show();
      } else {
        console.warn('Bootstrap Tab JavaScript not found. Manual tab activation might not work as expected.');
        // Fallback for visual active state if Bootstrap JS isn't loaded
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active', 'show'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active', 'show'));
        tabElement.classList.add('active', 'show');
        const targetPane = document.getElementById(tabId);
        if (targetPane) {
          targetPane.classList.add('active', 'show');
        }
      }
    }
  }
}