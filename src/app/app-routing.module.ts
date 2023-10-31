import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './@main/component-pages/home/home.component';
import { LoginComponent } from './security/login/login.component';

import { AuthorizerGuard } from './security/authorizer.guard';
import { AccessDeniedComponent } from './@main/component-pages/access-denied/access-denied.component';
import { PermissionComponent } from './account/permission/permission.component';
import { UserComponent } from './account/user/user.component';
import { CallbackComponent } from './security/callback/callback.component';
import { KeycloakComponent } from './security/keycloak/keycloak.component';
import { ApplicationComponent } from './core/application/application.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'keycloak/login',
    component: KeycloakComponent,
    canActivate: [],
  },
  {
    path: 'keycloak/callback',
    component: CallbackComponent,
    canActivate: [],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    canActivate: [],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthorizerGuard],
  },
  {
    path: 'permission',
    component: PermissionComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['sacc-permission-viewer'] }
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['sacc-user-viewer'] }
  },
  {
    path: 'application',
    component: ApplicationComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['scre-application-viewer'] }
  },
  {
    path: 'business-unit',
    component: ApplicationComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['scre-application-viewer'] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
