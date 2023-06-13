import { NgModule } from '@angular/core';
import { PermissionComponent } from './permission/permission.component';
import { UserComponent } from './user/user.component';
import { MainModule } from '../@main/main.module';
import { PermissionDialogComponent } from './permission-dialog/permission-dialog.component';

@NgModule({
  declarations: [
    PermissionComponent,
    UserComponent,
    PermissionDialogComponent,
  ],
  imports: [
    MainModule
  ]
})
export class AccountModule { }
