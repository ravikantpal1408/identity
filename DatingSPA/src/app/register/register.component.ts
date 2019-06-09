import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../services/account.service';
import { AlertifyService } from '../services/alertify.service';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // getting value from parent to child component
  @Input() valuesFromHome: any;

  // passing value from child to parent
  @Output() cancelRegister = new EventEmitter();

  bsConfig: Partial<BsDatepickerConfig>; // for setting up Bootstrap datepicker 

  user: User;
  registerForm: FormGroup;


  ngOnInit() {
    this.createRegisterForm();
    this.bsConfig = {
      containerClass : 'theme-blue',
    };
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', [Validators.required]),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),

    // },
    //   this.passwordMatchValidator);
  }


  constructor(
    private service: AccountService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router) {

  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender          : ['male'],
      knownAs         : ['', Validators.required],
      dateOfBirth     : [null, Validators.required],
      city            : ['', Validators.required],
      country         : ['', Validators.required],
      username        : ['', [Validators.required]],
      password        : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword : ['', [Validators.required]]
    }, {
        validator: this.passwordMatchValidator
      }
    )
  }

  
  passwordMatchValidator(ctrl: FormGroup) {
    return ctrl.get('password').value === ctrl.get('confirmPassword').value ? null : { mismatch: true };
  }

  register() {
    
    if(this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.service.registerService(this.user).subscribe(() => {
        this.alertify.success('Registration Successful');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.service.loginService(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        })
      });

    }

  }

  cancel() {
    // console.log('cancel');
    this.cancelRegister.emit(false);
  }
}
