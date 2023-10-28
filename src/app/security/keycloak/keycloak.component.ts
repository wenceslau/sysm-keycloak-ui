import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HandlerService } from 'src/app/@main/services/handler.service';
import { AuthorizerService } from 'src/app/security/authorizer.service';

@Component({
  selector: 'app-login',
  templateUrl: './keycloak.component.html',
  styleUrls: ['./keycloak.component.scss']
})
export class KeycloakComponent implements OnInit {

  constructor(
    private handler: HandlerService,
    private authorizer: AuthorizerService,
    private router: Router) {
  }
  ngOnInit(): void {
    console.log('ngOnInit')
    //check it user is logged, if no, request login on keycloak

    const nonce = Math.random().toString(36); // number use once, value to validade at my callback to avoid replay, the same value must be the same
    const state = Math.random().toString(36); // value inside html to avoid CSRF, it is send to keyclock, and it will delivery to me on URL parameter from callback 

    this.authorizer.store('nonce', nonce);
    this.authorizer.store('state', state);


    if (this.authorizer.authFlow == 'resource') {
      this.resourceFlow();

    } else if (this.authorizer.authFlow == 'authcode') {
      this.authCodeFlow(nonce, state);
    
    } else {
      this.implicityFlow(nonce, state)
    
    }
  }

  private resourceFlow() {
    this.router.navigate(['/login'])
  }

  private authCodeFlow(nonce: string, state: string) {
    const loginParams = new URLSearchParams({
      client_id: "wban-client",
      redirect_uri: "http://localhost:4200/keycloak/callback",
      response_type: "code",
      scope: "openid",
      //keycloak is already prepared to receive nonce and state, and send back within token and on url parameter
      nonce,
      state
    });

    const url = `http://localhost:8080/realms/master/protocol/openid-connect/auth?${loginParams.toString()}`;
    document.location.href = url;
  }

  private implicityFlow(nonce: string, state: string) {
    const loginParams = new URLSearchParams({
      client_id: "wban-client",
      redirect_uri: "http://localhost:4200/keycloak/callback",
      response_type: "token id_token",
      //keycloak is already prepared to receive nonce and state, and send back within token and on url parameter
      nonce,
      state
    });

    const url = `http://localhost:8080/realms/master/protocol/openid-connect/auth?${loginParams.toString()}`;
    document.location.href = url;
  }
}
