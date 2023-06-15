import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HandlerService } from './@main/services/handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wncsl-ui';

  constructor(
    private router: Router,
    public handler: HandlerService) {
  }

  isNotLogin(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/';
  }

}
