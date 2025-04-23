import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {



  userData = {
    userid: 'sanketdhavan',
    firstName: 'Sanket',
    lastName: 'Dhavan',
    emailid: 'sanketdhavan76@gmail.com',
    userType: 'MAKER',
    groupName: 'Premium Users',
    groupType: 'Business',
    groupSubtype: 'Enterprise',
    points: '500'
  };

  
  constructor() { }

  ngOnInit() {

    console.log(localStorage.getItem('userInfo'))
    

  }

}
