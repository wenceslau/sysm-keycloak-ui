import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionComponent } from './permission/permission.component';
import { UserComponent } from './user/user.component';



@NgModule({
  declarations: [
    PermissionComponent,
    UserComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AccountModule { }
