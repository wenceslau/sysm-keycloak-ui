import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './security/login/login.component';
import { AuthorizerGuard } from './security/authorizer.guard';

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
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['VIEWER_HOME'] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
