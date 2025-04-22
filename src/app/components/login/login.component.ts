import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../_services/login.service';
import { AuthService } from '../../_services/authentication.service';
import { GlobalAlertService } from '../../_services/global-alert.service';
import { GlobalLoaderService } from '../../_services/global-loader.service';
import { LogoComponent } from '../logo/logo.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [LogoComponent, CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  showPassword = false;
  forgotPasswordMode = false; // Controls form toggle

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private globalAlertService: GlobalAlertService,
    private globalLoaderService: GlobalLoaderService
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.forgotPasswordForm = this.fb.group({
      identifier: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}


  togglePasswordVisibility(state: boolean): void {
    this.showPassword = state;
  }
  

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleForgotPassword(): void {
    this.forgotPasswordMode = !this.forgotPasswordMode;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.globalAlertService.setMessage(
        'Please fill out the form correctly.',
        'danger'
      );
      return;
    }

    this.globalLoaderService.showLoader();
    const loginData = {
      userid: this.loginForm.value.identifier,
      password: this.loginForm.value.password,
      requestInit: new Date().toISOString(),
    };

    console.log(loginData)

    this.loginService.loginUser(loginData).subscribe({
      next: (response) => {
        this.globalLoaderService.hideLoader();
        if (response.code === '00') {
          this.globalAlertService.setMessage('Login successful!', 'success');
          this.authService.setUserInfo(response);
          if (response.token) {
            this.authService.setToken(response.token);
            this.authService.postLoginActions();
          } else {
            this.globalAlertService.setMessage(
              response.message || 'Invalid credentials.',
              'danger'
            );
          }
        } else {
          this.globalAlertService.setMessage(
            response.message || 'Invalid credentials.',
            'danger'
          );
          this.authService.clearToken();
        }
      },
      error: (error) => {
        this.globalLoaderService.hideLoader();
        this.globalAlertService.setMessage(
          'An error occurred. Please try again.',
          'danger'
        );
        this.authService.clearToken();
      },
    });
  }

  submitForgotPassword(): void {
    this.globalLoaderService.showLoader();

    const loginData = {
      userid: this.forgotPasswordForm.value.identifier,
      requestInit: new Date().toISOString(),
    };

    this.loginService.forgotPassword(loginData).subscribe({
      next: (response) => {
        this.globalLoaderService.hideLoader();
        if (response.code === '00') {
          this.globalAlertService.setMessage(
            'Password reset link sent!',
            'success'
          );
          this.forgotPasswordMode = false;
        } else {
          this.globalAlertService.setMessage(
            response.message || 'Could not send reset link.',
            'danger'
          );
        }
      },
      error: (error) => {
        console.log(error)
        this.globalLoaderService.hideLoader();
        this.globalAlertService.setMessage(
          'An error occurred. Please try again.',
          'danger'
        );
      },
    });
  }
}
