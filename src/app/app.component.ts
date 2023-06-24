import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { cilListNumbered, cilPaperPlane, brandSet } from '@coreui/icons'

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
    public handler: HandlerService,
    iconSet: IconSetService ) {
    iconSet.icons = { cilListNumbered, cilPaperPlane, ...brandSet };
  }

  isNotLogin(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/';
  }

}
