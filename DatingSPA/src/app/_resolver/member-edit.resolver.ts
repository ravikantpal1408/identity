import { Injectable } from "@angular/core";
import { User } from '../_models/User';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AccountService
    ) {

  }

  resolve(route: ActivatedRouteSnapshot) : Observable<User> {
    return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
      catchError(error => {
        this.alertify.error('Problem retrieving your data');
        this.router.navigate(['/members']);
        return of(null);
      })
    )
  }

}
