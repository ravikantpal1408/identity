import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { MessagesResolver } from './_resolver/messages.resolver';
import { ListResolver } from './_resolver/list.resolver';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { MessagesComponent } from "./messages/messages.component";
import { ListComponent } from "./list/list.component";
import { AuthGuard } from "./guard/auth.guard";
import { MemberDetailResolver } from "./_resolver/member-detail.resolver";
import { MemberListResolver } from "./_resolver/member-list.resolver";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { MemberEditResolver } from "./_resolver/member-edit.resolver";
import { PreventUnsavedChanges } from './guard/puv.gaurd';


const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        component: AdminPanelComponent,
        canActivate: [AuthGuard],
        data: { roles: ["Admin", "Moderator"] }
      },

      {
        path: "members",
        component: MemberListComponent,
        canActivate: [AuthGuard],
        resolve: { users: MemberListResolver },
        // data: { roles: ["Member"] }
      },
      {
        path: "members/:id",
        component: MemberDetailComponent,
        canActivate: [AuthGuard],
        resolve: { user: MemberDetailResolver },
        // data: { roles: ["Member"] }
      },
      {
        path: "member/edit",
        component: MemberEditComponent,
        canActivate: [AuthGuard],
        resolve: { user: MemberEditResolver },
        canDeactivate: [PreventUnsavedChanges],
        // data: { roles: ["Member"] }
      },
      {
        path: "messages",
        component: MessagesComponent,
        canActivate: [AuthGuard],
        resolve: { messages: MessagesResolver },
        // data: { roles: ["Member"] }

      },
      {
        path: "lists",
        component: ListComponent,
        canActivate: [AuthGuard],
        resolve: { users: ListResolver },
        // data: { roles: ["Member"] }

      },
      
    ]
  },

  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],


  exports: [RouterModule]
})
export class AppRoutingModule { }
