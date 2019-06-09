import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "src/app/_models/User";
import { UserService } from "../../services/user.service";
import { AlertifyService } from "../../services/alertify.service";
import { ActivatedRoute } from "@angular/router";
import { NgxGalleryAction, NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';



@Component({
  selector: "app-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.css"]
})
export class MemberDetailComponent implements OnInit {

  @ViewChild('memberTabs') memberTabs: TabsetComponent

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data["user"];
    });
    this.route.queryParams.subscribe(params => {
      const selectedTabs = params['tab'] > 0 ? params['tab'] : 0 ;
      // console.log(selectedTabs);
      this.memberTabs.tabs[selectedTabs].active = true;
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
  }


  getImages() {
    const imageUrls = [];
    for(let i = 0; i< this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      })
    }
    return imageUrls;
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }


}
