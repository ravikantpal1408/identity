import { AccountService } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(public authService: AccountService) {
    

   }

  ngOnInit() {
    console.log('role',this.authService.roleMatch(this.authService.decodedToken.role));
  }

}
