import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { User } from "src/app/_models/User";
import { AlertifyService } from "../../services/alertify.service";
import { NgForm } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { AccountService } from "../../services/account.service";

@Component({
  selector: "app-member-edit",
  templateUrl: "./member-edit.component.html",
  styleUrls: ["./member-edit.component.css"]
})
export class MemberEditComponent implements OnInit {
  user: User;
  photoUrl: string;

  @ViewChild("editForm") editForm: NgForm;
  @HostListener("window:beforeunload", ["$event"]) unloadNotification(
    $event: any
  ) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  
  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AccountService
  ) {}


  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    this.route.data.subscribe(data => {
      this.user = data["user"];
    });
  }


  updateUser() {
    this.userService
      .updateUser(this.authService.decodedToken.nameid, this.user)
      .subscribe(
        next => {
          this.alertify.success("Profile updated successfully");
          this.editForm.reset(this.user);
        },
        error => {
          this.alertify.error(error);
        }
      );
  }


  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}
