import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/_services/contracts.service';
import { GlobalAlertService } from 'src/app/_services/global-alert.service';
import { GlobalLoaderService } from 'src/app/_services/global-loader.service';


interface Industry {
  code: string;
  name: string;
  clauselibrarycodes: { [key: string]: string } | { [key: string]: { [key: string]: string } };
}

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CreateContractComponent implements OnInit {
  initiateForm!: FormGroup;
  industryCodes: Industry[] = [
    {
      code: '15',
      name: 'General',
      clauselibrarycodes: {
        '01': 'Non Disclosure Agreement - NDA'
      }
    },
    {
      code: '01',
      name: 'Mergers and Acquisitions',
      clauselibrarycodes: {
        '01': { '01': 'Term Sheet' },
        '02': { '02': 'Shareholder Agreement' }
      }
    }
  ];
  clauseLibraryOptions: { value: string; label: string }[] = [];
  defaultMakerUser: string = ''; // Initialize as empty
  showClauseLibrary: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contractService: ContractService,
    private globalLoaderService: GlobalLoaderService, // Inject loader service
    private globalAlertService: GlobalAlertService // Inject alert service
  ) { }

  ngOnInit(): void {
    // Get user info from local storage
    const userInfoString = localStorage.getItem('userInfo');
    let userInfo;
    if (userInfoString) {
      try {
        userInfo = JSON.parse(userInfoString);
        this.defaultMakerUser = userInfo.userid || ''; // Use userid from local storage
      } catch (error) {
        console.error('Error parsing userInfo from localStorage:', error);
        this.defaultMakerUser = ''; // Default to empty string on error
      }
    } else {
      this.defaultMakerUser = ''; // Default to empty string if not found
    }

    this.initiateForm = this.fb.group({
      contractName: ['', Validators.required],
      industryCode: ['', Validators.required],
      clauseLibraryCode: [{ value: '', disabled: true }, Validators.required], // Initially disabled
      makerUser: [this.defaultMakerUser, Validators.required] // Use value from local storage
    });

    // Subscribe to industryCode changes to update clauseLibrary options and visibility
    this.initiateForm.get('industryCode')?.valueChanges.subscribe(selectedIndustryCode => {
      this.updateClauseLibraryOptions(selectedIndustryCode);
      this.showClauseLibrary = !!selectedIndustryCode; // Show if an industry is selected
      this.initiateForm.get('clauseLibraryCode')?.setValue(''); // Reset clause library value on industry change
      if (!selectedIndustryCode) {
        this.initiateForm.get('clauseLibraryCode')?.disable();
      } else {
        this.initiateForm.get('clauseLibraryCode')?.enable();
      }
    });

    // Initialize clauseLibrary options based on the default or initial industry code
    this.updateClauseLibraryOptions(this.initiateForm.get('industryCode')?.value);
    this.showClauseLibrary = !!this.initiateForm.get('industryCode')?.value;
  }

  updateClauseLibraryOptions(industryCode: string | null) {
    this.clauseLibraryOptions = [];
    if (industryCode) {
      const selectedIndustry = this.industryCodes.find(industry => industry.code === industryCode);
      if (selectedIndustry && selectedIndustry.clauselibrarycodes) {
        for (const key in selectedIndustry.clauselibrarycodes) {
          if (typeof selectedIndustry.clauselibrarycodes[key] === 'string') {
            this.clauseLibraryOptions.push({ value: key, label: selectedIndustry.clauselibrarycodes[key] as string });
          } else if (typeof selectedIndustry.clauselibrarycodes[key] === 'object') {
            for (const subKey in selectedIndustry.clauselibrarycodes[key]) {
              this.clauseLibraryOptions.push({ value: subKey, label: (selectedIndustry.clauselibrarycodes[key] as { [key: string]: string })[subKey] });
            }
          }
        }
      }
    }
  }

onSubmit() {
    if (this.initiateForm.valid) {
      this.globalLoaderService.showLoader(); // Show loader before API call
      const formData = this.initiateForm.value;
      this.contractService.initiateContract(formData).subscribe({
        next: (response) => {
          this.globalLoaderService.hideLoader(); // Hide loader on success
          console.log('Contract initiated successfully:', response);
          this.router.navigate(['/contracts/drafts']);
          this.globalAlertService.setMessage('Contract initiated successfully!', 'success'); // Show success message
        },
        error: (error) => {
          this.globalLoaderService.hideLoader(); // Hide loader on error
          console.error('Error initiating contract:', error);
          let errorMessage = 'Error initiating contract. Please try again.';
          if (error?.error?.message) { // Check if the error response has a message property
            errorMessage = error.error.message; // Use the API's error message
          }
          this.globalAlertService.setMessage(errorMessage, 'danger'); // Show the specific or generic error
        }
      });
    } else {
      console.log('Form is invalid');
      this.globalAlertService.setMessage('Please fill in all required fields.', 'danger'); // Show validation message
    }
  }
}