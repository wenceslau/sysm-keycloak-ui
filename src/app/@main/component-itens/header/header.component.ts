import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HandlerService } from '../../services/handler.service';
import { AuthorizerService } from 'src/app/security/authorizer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private router: Router,
    private handler: HandlerService,
    private authorizer: AuthorizerService) {
  }


  reRouter(path: string): void {

    this.router.navigate(['/' + path])

  }

  logout(): void {

    if (this.authorizer.authFlow == 'resource') {
      this.handler.loading()
      this.authorizer.logoutResourceFlow()
        .then(result => {
          this.router.navigate(['/login'])
        }).catch(err => {
          let errMsg = this.handler.getError(err);
          if (errMsg == 'invalid_grant' || errMsg == 'unauthorized')
            errMsg = "User or password invalid"
          this.handler.addSnackBarError(errMsg);
        }).finally(() => {
          this.handler.loading()
        })
    } else if (this.authorizer.authFlow == 'authcode') {
      this.authorizer.logoutAuthCodeFlow();

    } else {
      this.authorizer.logoutImplicitFlow()
    }



  }

  userNameLooged(): string {
    return this.handler.nameLogged();
  }

}
