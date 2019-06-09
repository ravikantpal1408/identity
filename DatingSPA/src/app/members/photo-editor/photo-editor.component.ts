import { AlertifyService } from './../../services/alertify.service';
import { UserService } from './../../services/user.service';
import { AccountService } from './../../services/account.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;
  photoUrl: string;


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }


  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private allertify: AlertifyService
  ) { }

  ngOnInit() {
    this.initializeUploader();
  }


  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.accountService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain,
          isApproved: res.isApproved
        };
        console.log('user photo', photo)
        this.photos.push(photo);
        console.log('user photo', this.photos)
        if (photo.isMain) {
          this.accountService.changeMemberPhoto(photo.url);
          this.accountService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.accountService.currentUser));
        }
      }
    }
  }


  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.accountService.decodedToken.nameid, photo.id)
      .subscribe(() => {

        // console.log("successfully set to main");
        this.currentMain = this.photos.filter(p => p.isMain === true)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
        // this.getMemberPhotoChange.emit(photo.url);
        this.accountService.changeMemberPhoto(photo.url);
        this.accountService.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this.accountService.currentUser));

      }, error => {
        this.allertify.error(error);
      })
  }


  deletePhoto(id: number) {
    this.allertify.confirm('Are you sure you want to delete this photo ?', () => {
      this.userService.deletePhoto(this.accountService.decodedToken.nameid, id)
        .subscribe(() => {
          this.photos.splice(this.photos.findIndex(p => p.id == id), 1);
          this.allertify.success('Photo has been deleted .');
        }, error => {
          this.allertify.error("Failed to delete photo !");
        });
    });
  }


}
