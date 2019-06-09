import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  BASE_URI = environment.apiUrl + 'Auth';

  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();


  constructor(private http: HttpClient) { }


  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }


  loginService(loginFormValues: any) {
    return this.http.post(this.BASE_URI + '/login', loginFormValues).pipe(
      map((res: any) => {
        // console.log(res);
        const user = res;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.currentUser = user.user;
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.changeMemberPhoto(this.currentUser.photoUrl);
          // console.log(this.decodedToken);
        }
      })
    );
  }



  registerService(user: User) {
    return this.http.post(this.BASE_URI + '/register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }


  roleMatch(allowedRoles): Boolean {
    let isMatch = false;
    try {
      
      const userRoles = this.decodedToken.role as Array<string>;
      allowedRoles.forEach(element => {
        if (userRoles.includes(element)) {
          isMatch = true;
          return;
        }
      })

      return isMatch;
    }
    catch (err) {
      return isMatch;
    }
  }



}
