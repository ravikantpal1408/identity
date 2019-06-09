import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../services/alertify.service';
import { UserService } from './../services/user.service';
import { AccountService } from './../services/account.service';
import { Pagination, PaginatedResult } from './../_models/pagination';
import { Message } from './../_models/message';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(
    private authService: AccountService,
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) { }



  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    })
  }



  loadMessages() {
    // console.log(this.messageContainer)
    this.userService.getMessages(
      this.authService.decodedToken.nameid,
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.messageContainer)
      .subscribe((res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      })
  }



  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }


  deleteMessages(id: number) {
    this.alertify.confirm('Are you sure you want to delete this message', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid)
        .subscribe(() => {
          this.messages.splice(this.messages.findIndex(m=> m.id==id), 1);
          this.alertify.success("Message has been deleted");
        }, error => {
          this.alertify.error(error);
        })
    })
  }



}
