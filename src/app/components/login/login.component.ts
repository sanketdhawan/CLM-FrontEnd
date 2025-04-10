import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Platform } from '@ionic/angular';
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
  standalone: true,
  imports: [LogoComponent, ReactiveFormsModule,CommonModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private globalAlertService: GlobalAlertService,
    private globalLoaderService: GlobalLoaderService,
    private platform: Platform
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    console.log('Login form submitted');
    if (this.loginForm.invalid) {
      this.globalAlertService.setMessage('Please fill out the form correctly.', 'danger');
      return;
    }

    const formData = this.loginForm.value;
    this.globalLoaderService.showLoader();

    const loginData = {
      userid: formData.identifier,
      password: formData.password,
      requestInit: new Date().toISOString()
    };

    this.loginService.loginUser(loginData).subscribe({
      next: (response) => {
        this.globalLoaderService.hideLoader();
        // console.log('Backend Response:', response);
        this.authService.setUserInfo(response);
        if (response.code === '00') {
          this.globalAlertService.setMessage('Login successful!', 'success');
          this.loginForm.reset();

          const token = response.token;
          if (token) {
            this.authService.setToken(token);
            this.authService.postLoginActions();
            
          } else {
            this.globalAlertService.setMessage(response.message || 'Invalid email or password.', 'danger');
          }
        } else {
          this.globalAlertService.setMessage(response.message || 'Invalid email or password.', 'danger');
          this.authService.clearToken();
        }
      },
      error: (error) => {
        this.globalLoaderService.hideLoader();
        console.error('Error during login:', error);
        this.globalAlertService.setMessage('An error occurred. Please try again later.', 'danger');
        this.authService.clearToken();
      },
    });
  }
}