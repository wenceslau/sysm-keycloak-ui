import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private cookieService: CookieService) {
  }
  ngOnInit(): void {

    //check it user is logged, if no, request login on keycloak

    const nonce = Math.random().toString(36); // number use once, value to validade at my callback to avoid replay, the same value must be the same
    const state = Math.random().toString(36); // value inside html to avoid CSRF, it is send to keyclock, and it will delivery to me on URL parameter from callback 
  
    //lembrar armazenar com cookie seguro (https)
    this.cookieService.set('nonce', nonce);
    this.cookieService.set('state', state);

    this.authCodeFlow(nonce, state);

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
