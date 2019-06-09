import { AlertifyService } from './../../services/alertify.service';
import { UserService } from './../../services/user.service';
import { AccountService } from './../../services/account.service';
import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() user: User;

  constructor(
    private authService: AccountService, 
    private userService: UserService, 
    private alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(id: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, id)
      .subscribe(data => {
        this.alertify.success("You have liked: " + this.user.knownAs);
      }, error => {
        this.alertify.error(error);
      });
  }

}
