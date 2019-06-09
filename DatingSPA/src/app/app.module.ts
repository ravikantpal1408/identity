import { AdminService } from './services/admin.service';

import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { MessagesResolver } from './_resolver/messages.resolver';
import { AlertifyService } from './services/alertify.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule, PaginationModule, ButtonsModule, ModalModule } from 'ngx-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimeAgoPipe } from 'time-ago-pipe';




import { AppRoutingModule } from './routes.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AccountService } from './services/account.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './services/error.interceptor';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './guard/auth.guard';
import { UserService } from './services/user.service';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PreventUnsavedChanges } from './guard/puv.gaurd';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { ListResolver } from './_resolver/list.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { HasRoleDirective } from './_directives/hasRole.directive';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { RolesModalComponent } from './admin/roles-modal/roles-modal.component';


export function tokenGetter() {
   return localStorage.getItem('token');
}


@NgModule({
   declarations: [
      AppComponent,
      NavbarComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListComponent,
      MessagesComponent,
      MemberDetailComponent,
      MemberCardComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      TimeAgoPipe,
      MemberMessagesComponent,
      AdminPanelComponent,
      HasRoleDirective,
      UserManagementComponent,
      PhotoManagementComponent,
      RolesModalComponent 

   ],
   imports: [
      NgxGalleryModule,
      TabsModule.forRoot(),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      ModalModule.forRoot(),
      PaginationModule.forRoot(),
      ButtonsModule.forRoot(),
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      AppRoutingModule,
      FileUploadModule,
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      })
   ],
   providers: [
      AccountService,
      UserService,
      ErrorInterceptorProvider,
      AlertifyService,
      AuthGuard,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      PreventUnsavedChanges,
      ListResolver,
      MessagesResolver,
      AdminService
   ],
   entryComponents:[
      RolesModalComponent
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
