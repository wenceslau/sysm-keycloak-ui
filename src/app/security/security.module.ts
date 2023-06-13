import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MainModule } from '../@main/main.module';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    MainModule
  ]
})
export class SecurityModule { }
