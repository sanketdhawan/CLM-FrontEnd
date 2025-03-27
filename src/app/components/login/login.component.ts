import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Platform } from '@ionic/angular';
// import { SocialLogin } from '@capgo/capacitor-social-login';

import { LoginService } from '../../_services/login.service';
import { AuthService } from '../../_services/authentication.service';
import { GlobalAlertService } from '../../_services/global-alert.service';
import { GlobalLoaderService } from '../../_services/global-loader.service';
import { LogoComponent } from '../logo/logo.component';

interface GoogleLoginResponseOffline {
    responseType: 'offline';
    serverAuthCode: string;
}

interface GoogleLoginResponseOnline {
    responseType: 'online';
    accessToken: string;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [LogoComponent, ReactiveFormsModule, RouterLink],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

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
            // Changed 'email' to 'identifier' to accommodate username or email
            identifier: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
       // this.initializeApp();
    }

    // initializeApp(): void {
    //  SocialLogin.initialize({
    //   google: {
    //    webClientId: '384806860358-lqs2clvmbf2khja0f0irp92j848gq5c0.apps.googleusercontent.com', // Use Web Client ID for all platforms
    //    mode: 'offline', // replaces grantOfflineAccess
    //   },
    //  });
    // }

    // async signInWithGoogle(): Promise<void> {
    //  try {
    //   const res = await SocialLogin.login({
    //    provider: 'google',
    //    options: {
    //     scopes: ['email', 'profile'],
    //     forceRefreshToken: true, // if you need refresh token
    //    },
    //   });

    //   if (res.result.responseType === 'offline') {
    //    const serverAuthCode = res.result.serverAuthCode;
    //    console.log('Received Google Token:', serverAuthCode); // Log the received token
    //    this.handleCredentialResponse(serverAuthCode);
    //   } else {
    //    console.error('No serverAuthCode available. Response is online.');
    //    this.globalAlertService.setMessage('Google Login Failed. No serverAuthCode available.', 'danger');
    //   }
    //  } catch (error) {
    //   console.error('Error signing in with Google:', error);
    //   this.globalAlertService.setMessage('Error signing in with Google. Please try again.', 'danger');
    //  }
    // }

    // handleCredentialResponse(googleToken: string): void {
    //  console.log('Sending Google Token to backend:', googleToken); // Log the token being sent to the backend
    //  this.globalLoaderService.showLoader();

    //  this.loginService.verifyGoogleToken(googleToken).subscribe({
    //   next: (res) => {
    //    this.globalLoaderService.hideLoader();
    //    console.log('Backend Response:', res); // Log the backend response
    //    if (res.result === 'success') {
    //     this.globalAlertService.setMessage('Login successful!', 'success');
    //     this.authService.setToken(res.token);
    //     this.router.navigate(['/']);
    //    } else {
    //     this.globalAlertService.setMessage('Google Login Failed.', 'danger');
    //    }
    //   },
    //   error: (err) => {
    //    this.globalLoaderService.hideLoader();
    //    console.error('Error during Google Login:', err); // Log any error that occurs
    //    this.globalAlertService.setMessage('Error during Google Login.', 'danger');
    //   },
    //  });
    // }

    onSubmit(): void {
        console.log('Login form submitted');
        if (this.loginForm.invalid) {
            this.globalAlertService.setMessage('Please fill out the form correctly.', 'danger');
            return;
        }

        const formData = this.loginForm.value;
        this.globalLoaderService.showLoader();

        // Adapt the formData to match your Spring Boot API (userid, password, requestInit)
        const loginData = {
            userid: formData.identifier, // Use identifier (can be email or username)
            password: formData.password,
            requestInit: new Date().toISOString() // Or format as needed
        };

        this.loginService.loginUser(loginData).subscribe({
            next: (response) => {
                this.globalLoaderService.hideLoader();
                console.log('Backend Response:', response);

                if (response.code === '00') { // Check for success using code
                    this.globalAlertService.setMessage('Login successful!', 'success');
                    this.loginForm.reset();

                    // 1. Extract and store the token
                    const token = response.token;
                    if (token) {
                        this.authService.setToken(token); // Store the token
                        // 2. Redirect to a protected route (e.g., dashboard)
                        this.authService.postLoginActions(); // Use the redirection method
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