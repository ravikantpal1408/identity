import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  BASE_URI = environment.apiUrl;


  constructor(private http: HttpClient) { }


  getUsersWithRoles() {
    return this.http.get(this.BASE_URI + 'admin/usersWithRoles');
  }


  updateUserRoles(user: User, roles: {}) {
    return this.http.post(this.BASE_URI + 'admin/editRoles/' + user.userName, roles);
  }
  
  getPhotosForApproval() {
    return this.http.get(this.BASE_URI + 'admin/photosForModeration');
  }

  approvePhoto(photoId) {
    return this.http.post(this.BASE_URI + 'admin/approvePhoto/' + photoId, {});
  }

  rejectPhoto(photoId) {
    return this.http.post(this.BASE_URI + 'admin/rejectPhoto/' + photoId, {});
  }
}
