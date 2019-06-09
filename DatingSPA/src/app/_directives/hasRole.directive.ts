import { AccountService } from './../services/account.service';
import { Directive, Input, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {

  @Input() appHasRole: string[];
  isVisible = false;

  constructor(private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AccountService) {
      // console.log('directive test')
     }

  ngOnInit() {

    const userRoles = this.authService.decodedToken.role as Array<string> || '';

    console.log('has role ', userRoles);

    // if no roles clear the viewContainerRef
    if (!userRoles) {
      this.viewContainerRef.clear();
    }


    // if user has role need then render the element 
    if (this.authService.roleMatch(this.appHasRole)) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    }

  }

}
