import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { KeycloakComponent } from './keycloak/keycloak.component';
import { CallbackComponent } from './callback/callback.component';
import { MainModule } from '../@main/main.module';

@NgModule({
  declarations: [
    LoginComponent,
    KeycloakComponent,
    CallbackComponent,
  ],
  imports: [
    MainModule
  ]
})
export class SecurityModule { }
