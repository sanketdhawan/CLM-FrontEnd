import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../_services/register.service';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { GlobalAlertService } from '../../_services/global-alert.service';
import { GlobalLoaderService } from '../../_services/global-loader.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LogoComponent],
})
export class RegisterComponent {
  registerForm: FormGroup;
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private globalAlertService: GlobalAlertService,
    private globalLoaderService: GlobalLoaderService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role_id: ['3'], // Default to Admin Login
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.alertType = 'danger';
      this.alertMessage = 'Please fill out the form correctly.';
      return;
    }

    const formData = this.registerForm.value;

    this.registerService.registerUser(formData).subscribe({
      next: (response) => {
        if (response.result === 'success') {
          this.globalAlertService.setMessage(
            response.message || 'Registration successful!',
            'success'
          );
          this.registerForm.reset();
        } else {
          this.globalAlertService.setMessage(
            response.message || 'Registration failed. Please try again.',
            'danger'
          );
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.globalAlertService.setMessage(
          'Registration failed. Please try again.',
          'danger'
        );
      },
      complete: () => {
        // Any cleanup or final steps can be placed here
      },
    });
  }
}
