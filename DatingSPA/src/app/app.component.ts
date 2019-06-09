import { User } from 'src/app/_models/User';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  jwtHelper = new JwtHelperService();

  constructor(private account: AccountService) {

  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token) {
      this.account.decodedToken = this.jwtHelper.decodeToken(token);
    }

    if(user) {
      
      this.account.currentUser = user;
      this.account.changeMemberPhoto(user.photoUrl);
      // console.log(this.account.currentUser)
    }

  }
}
