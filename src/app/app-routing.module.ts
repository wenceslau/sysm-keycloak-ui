import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './security/login/login.component';
import { AuthorizerGuard } from './security/authorizer.guard';
import { AccessDeniedComponent } from './main/access-denied/access-denied.component';
import { PermissionComponent } from './account/permission/permission.component';
import { UserComponent } from './account/user/user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthorizerGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    canActivate: [AuthorizerGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_VIEW_USER', 'ROLE_CREATE_USER'] }
  },
  {
    path: 'permission',
    component: PermissionComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_VIEW_PERMISSION', 'ROLE_CREATE_PERMISSION'] }
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_VIEW_USER1', 'ROLE_CREATE_USER1'] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
