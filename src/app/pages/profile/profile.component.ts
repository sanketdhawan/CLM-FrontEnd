import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  userData: any = {
    userid: 'NA',
    firstName: 'NA',
    lastName: 'NA',
    emailid: 'NA',
    userType: 'NA',
    groupName: 'NA',
    groupType: 'NA',
    groupSubtype: 'NA',
    points: 'NA'
  };

  constructor() { }

  ngOnInit() {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        this.userData = {
          userid: userInfo.userid !== null && userInfo.userid !== undefined ? userInfo.userid : 'NA',
          firstName: userInfo.firstName !== null && userInfo.firstName !== undefined ? userInfo.firstName : 'NA',
          lastName: userInfo.lastName !== null && userInfo.lastName !== undefined ? userInfo.lastName : 'NA',
          emailid: userInfo.emailid !== null && userInfo.emailid !== undefined ? userInfo.emailid : 'NA',
          userType: userInfo.userType !== null && userInfo.userType !== undefined ? userInfo.userType : 'NA',
          groupName: userInfo.groupName !== null && userInfo.groupName !== undefined ? userInfo.groupName : 'NA',
          groupType: userInfo.groupType !== null && userInfo.groupType !== undefined ? userInfo.groupType : 'NA',
          groupSubtype: userInfo.groupSubtype !== null && userInfo.groupSubtype !== undefined ? userInfo.groupSubtype : 'NA',
          points: userInfo.points !== null && userInfo.points !== undefined ? userInfo.points : 'NA'
        };
        console.log('User Data from Local Storage:', this.userData);
      } catch (error) {
        console.error('Error parsing user info from local storage:', error);
        // Optionally provide default values or handle the error as needed
      }
    } else {
      console.warn('No user info found in local storage.');
      // Optionally provide default values if no data is in local storage
    }
  }

}