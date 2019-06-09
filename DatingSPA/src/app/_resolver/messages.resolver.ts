import { AccountService } from './../services/account.service';
import { Message } from './../_models/message';
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 5;
  messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private authService: AccountService,
    private router: Router,
    private alertify: AlertifyService
    ) {

  }

  resolve(route: ActivatedRouteSnapshot) : Observable<Message[]> {
    return this.userService.getMessages(this.authService.decodedToken.nameid, 
        this.pageNumber, this.pageSize, this.messageContainer).pipe(
      catchError(error => {
        this.alertify.error('Problem retrieving messages');
        this.router.navigate(['/home']);
        return of(null);
      })
    )
  }

}
