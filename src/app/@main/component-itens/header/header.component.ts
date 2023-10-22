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


  constructor(private router: Router, private handler: HandlerService,
    private authorizer: AuthorizerService) {
  }


  reRouter(path: string): void{

    this.router.navigate(['/'+path])

  }

  logout(): void{

    this.authorizer.keycloakLogoutAuthCodeFlow();

  }

  userNameLooged(): string {
    return this.handler.userNameLogged();
  }

}
