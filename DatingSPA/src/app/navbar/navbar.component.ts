import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { AlertifyService } from '../services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  model: any = {};
  photoUrl: string;


  constructor(private fb: FormBuilder,
              public account: AccountService,
              private alertify: AlertifyService,
              private router: Router) { }
              

  ngOnInit() {

    this.account.currentPhotoUrl.subscribe(photoUrl => this.photoUrl =photoUrl);

    console.log(this.account.roleMatch(['Admin', 'Moderator']))

  }


  onSubmit() {

    // console.log(this.model);

    this.account.loginService(this.model).subscribe((res: any) => {
      // console.log(res);
      this.model = {};
      this.alertify.success('Logged in Successfully');
    }, error => {
      console.log(error);
      this.alertify.error(error);
    }, () => {
      this.router.navigate(['/members']);
    });

  }


  loggedIn() {
    // const token = localStorage.getItem('token');
    // return !!token;
    return this.account.loggedIn();
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.account.decodedToken = null;
    this.account.currentUser = null;
    this.alertify.error('You are logged out');
    this.router.navigate(['/home']);

  }


  
}
