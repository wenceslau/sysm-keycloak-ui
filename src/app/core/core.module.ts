import {NgModule} from '@angular/core';
import {ApplicationComponent} from './application/application.component';
import {MainModule} from "../@main/main.module";

@NgModule({
  declarations: [
    ApplicationComponent
  ],
    imports: [
        MainModule
    ]
})
export class CoreModule { }
