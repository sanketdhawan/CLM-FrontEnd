import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss'],
  imports:[ReactiveFormsModule,CommonModule]
})
export class CreateContractComponent {

    initiateForm!: FormGroup;

  constructor() { }

   onSubmit(){

   }

}
