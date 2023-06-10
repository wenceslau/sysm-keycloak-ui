import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { HomeComponent } from './home/home.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';


import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    HomeComponent,
    AccessDeniedComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,

    //Material
    MatSlideToggleModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,

    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    HttpClientModule,

    //Material
    MatSlideToggleModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,

    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ]
})
export class MainModule { }
