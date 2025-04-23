import { Component, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalAlertService } from 'src/app/_services/global-alert.service';
import { GlobalLoaderService } from 'src/app/_services/global-loader.service';
import { LoginService } from 'src/app/_services/login.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
  standalone: true
})
export class UpdatePasswordComponent {
  activeModal = inject(NgbActiveModal);
  @Input() userData: any;

  updatePasswordForm: FormGroup;

  constructor(private globalAlertService: GlobalAlertService, private fb: FormBuilder,
    private globalLoaderService: GlobalLoaderService, private loginService: LoginService,
  ) {
    this.updatePasswordForm = this.fb.group({
      identifier: ['', [Validators.required]],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    
    if (this.userData) {
      this.updatePasswordForm.patchValue({
        identifier: this.userData.firstName + ' ' +  this.userData.lastName
      });
    }
  }


  onSubmit(): void {

    this.globalLoaderService.showLoader();

    const passwordData = {
      userid: this.userData.userid,
      oldPassword: this.updatePasswordForm.value.oldPassword,
      newPassword: this.updatePasswordForm.value.newPassword,
      requestInit: new Date().toISOString(),
    };

    console.log(this.updatePasswordForm.value)

    this.loginService.updatePassword(passwordData).subscribe({
      next: (response) => {
        this.globalLoaderService.hideLoader();
        if (response.code === '00') {
          this.globalAlertService.setMessage(
            'Password Updated Successfully!',
            'success'
          );
          this.activeModal.close();
        } else {
          this.globalAlertService.setMessage(
            response.message || 'Could Not Update Password.',
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
