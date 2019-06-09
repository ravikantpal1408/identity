import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../services/alertify.service';
import { UserService } from './../services/user.service';
import { AccountService } from './../services/account.service';
import { Pagination, PaginatedResult } from './../_models/pagination';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  users: User[];
  pagination: Pagination;
  likesParams: string;

  constructor(
    private authService: AccountService,
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    })
  }


  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      })
  }


  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    // console.log(this.pagination);
    this.loadUsers();
  }

}
