import { AlertifyService } from './../../services/alertify.service';
import { AdminService } from './../../services/admin.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';
import { ValueTransformer } from '@angular/compiler/src/util';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: User[];
  bsModalRef: BsModalRef;
  constructor(
    private adminService: AdminService,
    private alertifyService: AlertifyService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }


  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe((users: User[]) => {

      this.users = users;
      // console.log(this.users)

    }, error => {
      this.alertifyService.error(error);
      console.log(error);
    })
  }



  editRolesModals(user: User) {
    console.log(user);
    const initialState = {
      user,
      roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, { initialState });
    this.bsModalRef.content.updateSelectedRoles.subscribe((val) => {
      const rolesToUpdate = {
        roleNames: [...val.filter(el => el.checked === true).map(el=>el.name)]
      }
      console.log(rolesToUpdate);
      if(rolesToUpdate) {
        this.adminService.updateUserRoles(user, rolesToUpdate).subscribe(()=>{
          user.roles = [...rolesToUpdate.roleNames];
          this.alertifyService.success("Roles updated successfully");
        }, error => {
          this.alertifyService.error(error);
        })
      }
    })
  }


  private getRolesArray(user) {
    const roles = [];

    try {
      const userRoles = user.roles;
      const availableRoles: any[] = [
        { name: "Admin", value: "Admin" },
        { name: "Moderator", value: "Moderator" },
        { name: "Member", value: "Member" },
        { name: "VIP", value: "VIP" }
      ];
      for (let i = 0; i < availableRoles.length; i++) {
        let isMatch = false;
        for (let j = 0; j < userRoles.length; j++) {
          if (availableRoles[i].name === userRoles[j]) {
            isMatch = true;
            availableRoles[i].checked = true;
            roles.push(availableRoles[i]);
            break;
          }
        }
        if (!isMatch) {
          availableRoles[i].checked = false;
          roles.push(availableRoles[i]);
        }
      }
      return roles;
    }
    catch (err) {
      return roles;
    }
  }


}
