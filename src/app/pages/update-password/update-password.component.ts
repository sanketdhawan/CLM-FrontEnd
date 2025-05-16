import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalAlertService } from 'src/app/_services/global-alert.service';
import { GlobalLoaderService } from 'src/app/_services/global-loader.service';
import { LoginService } from 'src/app/_services/login.service';

// Custom validator function for password complexity
function passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
  const value = control.value;
  if (!value) {
    return null;
  }

  const hasNumber = /[0-9]/.test(value);
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isLongEnough = value.length >= 8;

  const isValid = hasNumber && hasLetter && hasSpecialChar && isLongEnough;

  return isValid ? null : { weakPassword: true };
}

// Custom validator function to check if passwords match
function passwordMatchValidator(formGroup: FormGroup) {
  const newPasswordControl = formGroup.controls['newPassword'];
  const confirmPasswordControl = formGroup.controls['confirmPassword'];

  if (!newPasswordControl || !confirmPasswordControl) {
    return null;
  }

  if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
    // return if another validator has already found an error on the matchingControl
    return null;
  }

  if (newPasswordControl.value !== confirmPasswordControl.value) {
    confirmPasswordControl.setErrors({ passwordMismatch: true });
  } else {
    confirmPasswordControl.setErrors(null);
  }
  return null;
}

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class UpdatePasswordComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() userData: any;
  @Input() isFirstLogin: boolean = false; // Input to indicate first login

  updatePasswordForm: FormGroup;

  constructor(
    private globalAlertService: GlobalAlertService,
    private fb: FormBuilder,
    private globalLoaderService: GlobalLoaderService,
    private loginService: LoginService
  ) {
    this.updatePasswordForm = this.fb.group(
      {
        identifier: ['', [Validators.required]],
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, passwordStrengthValidator]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    if (this.userData) {
      this.updatePasswordForm.patchValue({
        identifier: this.userData.userid,
      });
    }
  }

  onSubmit(): void {
    if (this.updatePasswordForm.invalid) {
      Object.values(this.updatePasswordForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.globalLoaderService.showLoader();

    const passwordData = {
      userid: this.userData.userid,
      oldPassword: this.updatePasswordForm.value.oldPassword,
      newPassword: this.updatePasswordForm.value.newPassword,
      requestInit: new Date().toISOString(),
    };

    this.loginService.updatePassword(passwordData).subscribe({
      next: (response) => {
        this.globalLoaderService.hideLoader();
        if (response.code === '00') {
          this.globalAlertService.setMessage('Password Updated Successfully!', 'success');
          this.activeModal.close();
          const storedUserData = localStorage.getItem('userInfo');
          if (storedUserData) {
            const userInfo = JSON.parse(storedUserData);
            userInfo.firstLoginFlag = 'N';
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
          }
        } else {
          this.globalAlertService.setMessage(
            response.message || 'Could Not Update Password.',
            'danger'
          );
        }
      },
      error: (error) => {
        console.log(error);
        this.globalLoaderService.hideLoader();
        this.globalAlertService.setMessage('An error occurred. Please try again.', 'danger');
      },
    });
  }
}