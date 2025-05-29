// edit-contract.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContractService } from 'src/app/_services/contracts.service';
import { GlobalAlertService } from 'src/app/_services/global-alert.service';
import { GlobalLoaderService } from 'src/app/_services/global-loader.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs'; // Import Subscription for managing observables

interface ContractDetails {
  mis01Model: any;
  contractResponse: any;
}

interface DropdownOption {
  value: string | number;
  label: string;
}

declare const bootstrap: any; // Declare bootstrap to avoid TypeScript errors if not imported globally

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
  tabsWithErrors: { [tabId: string]: boolean } = {}; // Track tabs with errors

  private currentUserInfo: { userId?: string } | null = null; // Assuming you have a way to get user info
  private readonly LOCAL_STORAGE_KEY_PREFIX = 'contractEditTab_';
  private readonly LOCAL_STORAGE_FORM_STATE_PREFIX = 'contractEditFormState_';
  private formStatusSubscription!: Subscription; // Subscription to manage form status changes

  invalidFields: string[] = []; // Property to hold names of invalid fields for alert message
  firstInvalidTab: string = ''; // Property to hold the ID of the first tab with an error

  formSubmitted: boolean = false; // Flag to track form submission

  // Mapping from form control name to display name for user-friendly error messages
  private fieldDisplayNames: { [key: string]: string } = {
    contractName: 'Client Name',
    contractFor: 'Contract For',
    pncdp: 'Disclosing Party Entity Type',
    pncrp: 'Recipient Party Entity Type',
    pncdpCname: 'Disclosing Party Entity Name',
    pncrpCname: 'Recipient Party Entity Name',
    pncdpCadd: 'Disclosing Party Entity Address',
    pncrpCadd: 'Recipient Party Entity Address',
    pncdpCpan: 'Disclosing Party Entity PAN',
    pncrpCpan: 'Recipient Party Entity PAN',
    pncdpP1: 'Disclosing Party Designated Person 1',
    pncrpP1: 'Recipient Party Designated Person 1',
    pncdpP1pan: 'Disclosing Party Designated Person 1 PAN',
    pncrpP1pan: 'Recipient Party Designated Person 1 PAN',
    pncdpP2: 'Disclosing Party Designated Person 2',
    pncrpP2: 'Recipient Party Designated Person 2',
    pncdpP2pan: 'Disclosing Party Designated Person 2 PAN',
    pncrpP2pan: 'Recipient Party Designated Person 2 PAN',
    recRpb: 'Recipient Party Business',
    recDpb: 'Disclosing Party Business',
    recBusp: 'Business Purpose',
    tcDur: 'Duration of Term',
    rc: 'Liability Clause Type',
    gc: 'Governing Law Clause Type',
    gcCountry: 'Governing Country',
    gcCity: 'Governing City',
    nsc: 'Non-Solicitation Clause', // Added for completeness, though it's a checkbox
    sigDPName: 'Disclosing Party Signature Name',
    sigRPName: 'Recipient Party Signature Name',
    sigDPDes: 'Disclosing Party Designation',
    sigRPDes: 'Recipient Party Designation',
    miscDPADD: 'Disclosing Party Notice Address, Email and Contact',
    miscRPADD: 'Recipient Party Notice Address, Email and Contact',
    miscDpATT: 'Disclosing Party Notice Attention',
    miscRPATT: 'Recipient Party Notice Attention',
    dpNickname: 'Disclosing Party Entity Represented Name',
    rpNickname: 'Recipient Party Entity Represented Name',
    obcBp: 'OBC Business Purpose',
    eDate: 'Effective Date' // Added eDate display name
  };

  // Mapping from form control name to the tab ID it belongs to
  private fieldToTabMap: { [key: string]: string } = {
    contractName: 'parties',
    contractFor: 'parties',
    pncdp: 'parties',
    pncrp: 'parties',
    pncdpCname: 'parties',
    pncrpCname: 'parties',
    pncdpCadd: 'parties',
    pncrpCadd: 'parties',
    pncdpCpan: 'parties',
    pncrpCpan: 'parties',
    pncdpP1: 'parties',
    pncrpP1: 'parties',
    pncdpP1pan: 'parties',
    pncrpP1pan: 'parties',
    pncdpP2: 'parties',
    pncrpP2: 'parties',
    pncdpP2pan: 'parties',
    pncrpP2pan: 'parties',
    dpNickname: 'parties',
    rpNickname: 'parties',

    eDate: 'other-details', // Added eDate to the other-details tab
    recRpb: 'other-details',
    recDpb: 'other-details',
    recBusp: 'other-details',
    tcDur: 'other-details',
    obcBp: 'other-details', // Ensure this is mapped
    rc: 'other-details',
    nsc: 'other-details',
    gc: 'other-details',
    gcCountry: 'other-details',
    gcCity: 'other-details',

    sigDPName: 'signatory',
    sigRPName: 'signatory',
    sigDPDes: 'signatory',
    sigRPDes: 'signatory',
    miscDPADD: 'signatory',
    miscRPADD: 'signatory',
    miscDpATT: 'signatory',
    miscRPATT: 'signatory',
  };

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
    // Dummy user info for local storage key. Replace with actual user service.
    this.currentUserInfo = { userId: 'current_user' };

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
      eDate: [''], // Added eDate field here
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

    this.loadActiveTabState(); // Load previously active tab
    this.loadFormState(); // Load saved form state

    // Subscribe to form status changes to update error dots in real-time
    // Only update if form has been submitted
    this.formStatusSubscription = this.editForm.statusChanges.subscribe(() => {
      if (this.formSubmitted) { // Only update if form has been submitted
        this.updateTabErrorStatus();
      }
    });

    // Initial check for errors after form is initialized (and potentially populated)
    // No initial call to updateTabErrorStatus here, as we want it only on submit
  }

  ngAfterViewInit(): void {
    this.initBootstrapTabs();
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.formStatusSubscription) {
      this.formStatusSubscription.unsubscribe();
    }
    // Save active tab state if user info is available
    if (this.currentUserInfo?.userId) {
      localStorage.setItem(
        `${this.LOCAL_STORAGE_KEY_PREFIX}${this.currentUserInfo.userId}`,
        this.activeTabId
      );
    }
    // Save form state when component is destroyed
    if (this.editForm.dirty) {
      this.saveFormState();
    }
  }

  private saveFormState(): void {
    if (this.contractId && this.currentUserInfo?.userId) {
      const formState = JSON.stringify(this.editForm.value);
      localStorage.setItem(
        `${this.LOCAL_STORAGE_FORM_STATE_PREFIX}${this.currentUserInfo.userId}_${this.contractId}`,
        formState
      );
    }
  }

  private loadFormState(): void {
    if (this.contractId && this.currentUserInfo?.userId) {
      const savedState = localStorage.getItem(
        `${this.LOCAL_STORAGE_FORM_STATE_PREFIX}${this.currentUserInfo.userId}_${this.contractId}`
      );
      if (savedState) {
        const formValue = JSON.parse(savedState);
        this.editForm.patchValue(formValue);
        // Do NOT mark all as touched here, only mark after submission
        // this.editForm.markAllAsTouched();
        // this.updateTabErrorStatus(); // Update tab error status after loading state
      }
    }
  }

  private loadActiveTabState(): void {
    if (this.currentUserInfo?.userId) {
      const savedTab = localStorage.getItem(
        `${this.LOCAL_STORAGE_KEY_PREFIX}${this.currentUserInfo.userId}`
      );
      if (savedTab) {
        this.activeTabId = savedTab;
      }
    }
  }

  // Modified onTabClick to handle tab activation and error status update
  onTabClick($event: Event, tabId: string): void {
    $event.preventDefault(); // Prevent default anchor behavior
    this.activeTabId = tabId;
    if (this.currentUserInfo?.userId) {
      localStorage.setItem(
        `${this.LOCAL_STORAGE_KEY_PREFIX}${this.currentUserInfo.userId}`,
        tabId
      );
    }
    // Manually activate Bootstrap tab
    const tabEl = document.querySelector(`#${this.activeTabId}-tab`);
    if (tabEl) {
      const tab = new bootstrap.Tab(tabEl);
      tab.show();
    }
    if (this.formSubmitted) { // Only update status if form has been submitted
      this.updateTabErrorStatus();
    }
  }

  private initBootstrapTabs(): void {
    const tabEl = document.querySelector(`#${this.activeTabId}-tab`);
    if (tabEl) {
      const tab = new bootstrap.Tab(tabEl);
      tab.show();
    }
  }

  loadContractDetails(id: string): void {
    this.globalLoaderService.showLoader();
    this.contractNotFound = false;

    this.contractService.fetchContractDetails({ contractID: parseInt(this.contractId!, 10) }).subscribe({
      next: (data) => {
        if (data && data.mis01Model) {
          this.contractDetails = data;
          this.populateForm(data.mis01Model);
          // After populating, do NOT update the error status immediately
          // this.updateTabErrorStatus();
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
      miscDpATT: model.miscDpATT || model.miscDPATT || model.miscDpAtt || '',
      eDate: model.eDate || '' // Added eDate population
    };
    this.editForm.patchValue(formValue);
    // Do NOT mark fields as touched after populating
    // this.editForm.markAllAsTouched();
    // this.updateTabErrorStatus(); // Update tab error status after populating
  }

  // New method to update the error status of tabs
  private updateTabErrorStatus(): void {
    // Reset all tab error statuses
    ['parties', 'other-details', 'signatory'].forEach(tabId => {
      this.tabsWithErrors[tabId] = false;
    });

    // Iterate through form controls and set tab error status
    for (const controlName in this.editForm.controls) {
      if (Object.prototype.hasOwnProperty.call(this.editForm.controls, controlName)) {
        const control = this.editForm.get(controlName);
        const tabId = this.fieldToTabMap[controlName];

        if (control && tabId) {
          // Check if control is invalid and (if form has been submitted, check touched/dirty)
          if (control.invalid && this.formSubmitted) { // Only show errors if form has been submitted
            this.tabsWithErrors[tabId] = true;
          }
        }
      }
    }
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
    // For eDate, if it's an empty string, convert it to null for the API if necessary,
    // but the provided JSON shows null directly, so we can keep it as is if API expects "" for empty.
    // If the API expects null for empty date, uncomment the line below.
    // cleanedData['eDate'] = formData.eDate === '' ? null : formData.eDate;
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
          this.editForm.markAsPristine(); // Mark form as pristine
          this.editForm.markAsUntouched(); // Mark all controls as untouched to clear validation styles
          this.formSubmitted = false; // Reset form submission flag to hide tab error dots
          this.updateTabErrorStatus(); // Update tab error status to ensure dots are cleared
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
    this.formSubmitted = true; // Set flag to true on submit
    // Mark all fields as touched to trigger validation and update error dots
    this.editForm.markAllAsTouched();
    this.updateTabErrorStatus();

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
          this.router.navigate(['/contracts/closed']); // Redirect on success
        },
        error: (error) => {
          console.error('Error submitting contract details:', error);
          this.globalLoaderService.hideLoader();
          this.globalAlertService.setMessage(error.message || 'Error submitting contract details.', 'danger');
          // If submission fails, update error dots
          this.updateTabErrorStatus();
        },
      });
    } else if (this.contractNotFound) {
      this.globalAlertService.setMessage('Cannot submit: No contract found with this ID.', 'danger');
    } else {
      // Show specific invalid fields in the alert message
      this.getInvalidAndRequiredFields();
      const invalidFieldNames = this.invalidFields;
      let errorMessage = 'Please correct the form errors before submitting.';
      if (invalidFieldNames.length > 0) {
        // Construct an HTML unordered list for the invalid fields.
        // NOTE: This will only render as an actual HTML list if the GlobalAlertService
        // and the component displaying it are configured to render HTML (e.g., using [innerHTML]).
        // If not, the <ul> and <li> tags will appear as plain text in the alert message.
        const invalidFieldsHtmlList = invalidFieldNames.map(field => `<li>${field}</li>`).join('');
        errorMessage += `\n\nInvalid fields:\n<ul>${invalidFieldsHtmlList}</ul>`;
      }
      this.globalAlertService.setMessage(errorMessage, 'danger');

      // If the first invalid tab is identified, switch to it
      if (this.firstInvalidTab && this.activeTabId !== this.firstInvalidTab) {
        this.onTabClick(new Event('click'), this.firstInvalidTab); // Simulate a click to switch tab
      }
    }
  }

  // Method to get invalid and required fields for alert message and identify the first invalid tab
  getInvalidAndRequiredFields(): void {
    this.invalidFields = [];
    this.firstInvalidTab = '';

    // Define the order of tabs for priority
    const tabOrder = ['parties', 'other-details', 'signatory'];

    // Temporary list to store invalid controls with their tab info, before sorting
    const tempInvalidControls: { controlName: string, tabId: string, order: number }[] = [];

    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      if (control) {
        // Only consider invalid controls after form submission
        if (control.invalid && this.formSubmitted) { // Ensure this aligns with showing errors on submit
          const tabId = this.fieldToTabMap[key];
          if (tabId) {
            tempInvalidControls.push({
              controlName: key,
              tabId: tabId,
              order: tabOrder.indexOf(tabId) // Get the order of the tab
            });
          }
        }
      }
    });

    // Sort invalid controls by their tab order
    tempInvalidControls.sort((a, b) => a.order - b.order);

    // Populate invalidFields and set firstInvalidTab based on sorted order
    for (const item of tempInvalidControls) {
      this.invalidFields.push(this.fieldDisplayNames[item.controlName] || item.controlName);
      if (!this.firstInvalidTab) {
        this.firstInvalidTab = item.tabId; // Set the first invalid tab encountered
      }
    }
  }

  // This method checks if the current tab is the last tab (for conditional submit button display)
  isLastTab(tabId: string): boolean {
    return tabId === 'signatory'; // Assuming 'signatory' is your last tab
  }
}