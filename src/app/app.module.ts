import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from './@main/main.module';
import { SecurityModule } from './security/security.module';
import { AccountModule } from './account/account.module';
import { LoginComponent } from './keycloak/login/login.component';
import { CallbackComponent } from './keycloak/callback/callback.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallbackComponent,
  ],
  imports: [
    AppRoutingModule,
    MainModule,
    SecurityModule,
    AccountModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
