import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerModel = false;

  constructor(private router: Router) {
    // console.log('register');
    if (localStorage.getItem('token') != null) {
      this.router.navigate(['/members']);
    }
  }

  ngOnInit() {
  }


  registerToggle() {
    this.registerModel = !this.registerModel;
  }


  cancelRegisterMode(registerMode: boolean) {
    this.registerModel = registerMode;
  }

}
