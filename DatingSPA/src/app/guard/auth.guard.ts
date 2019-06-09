import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AccountService } from '../services/account.service';
import { AlertifyService } from '../services/alertify.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private service: AccountService,
    private router: Router,
    private alertify: AlertifyService
  ) {

  }
  canActivate(next: ActivatedRouteSnapshot): boolean {
    try {

      const roles = next.firstChild.data['roles'] as Array<string>;

      if (roles) {
        const match = this.service.roleMatch(roles);
        if (match) {
          return true;
        }
        else {
          this.router.navigate(['members']);
          this.alertify.error("You are not authorised to access this area");
        }
      }
    }
    catch (err) {
      // console.log(err);
    }

    if (this.service.loggedIn()) {
      return true;
    }

    this.alertify.error('You shall not pass !!');
    this.router.navigate(['/home']);
    return false;
  }
}
