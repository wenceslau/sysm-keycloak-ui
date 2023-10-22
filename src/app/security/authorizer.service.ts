import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, lastValueFrom, throwError } from 'rxjs';
import { retry, catchError, map, tap } from 'rxjs/operators';
import { HandlerService } from '../@main/services/handler.service';


@Injectable({
  providedIn: 'root'
})
export class AuthorizerService {

  oauthTokenUrl: any;     // URL da API  
  jwtPayload: any;        // Armazena o json do token, o payload

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService) {
    this.loadToken();
  }

  async login(email: string, password: string): Promise<any> {
    this.clearToken();

    this.oauthTokenUrl = 'http://localhost:8081/oauth/token'
    let headers = new HttpHeaders();

    // enviado como post, preciso do content typ para ler o body como um query string
    headers = headers
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic d2ViOkB3ZWIxMjM=');

    const body = `username=${email}&password=${password}&grant_type=password`;

    let observable: Observable<any>;
    observable = this.http.post<any>(this.oauthTokenUrl, body, { headers, withCredentials: true })
    const source$ = observable.pipe();

    return await lastValueFrom(source$)
      .then(response => {
        this.storeToken(response.access_token);
        return response;
      })
    // return this.http.post<any>(this.oauthTokenUrl, body, { headers, withCredentials: true })
    //   .pipe(
    //     retry(1),
    //     map(resp => {
    //       this.storeToken(resp.access_token);
    //       return resp.access_token;
    //     }),
    //     catchError(err =>
    //       this.handleError(err)
    //     ))
  }

  //Flow Authorization code, get the token by authorization code
  async keycloakTokenAuthCodeFlow(authCode: string): Promise<any> {
    this.clearToken();

    this.oauthTokenUrl = 'http://localhost:8080/realms/master/protocol/openid-connect/token'
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded')


    const loginParams = new URLSearchParams({
      client_id: "wban-client",
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: "http://localhost:4200/keycloak/callback"
    });

    const body =loginParams.toString();

    let observable: Observable<any>;
    observable = this.http.post<any>(this.oauthTokenUrl, body, { headers, withCredentials: true })
    const source$ = observable.pipe();

    return await lastValueFrom(source$)
      .then(response => {
        //Validate if nonce received here is the same that was send in request auth code
        //validate state to avoid CSRF atack
        console.log(response)
        this.storeToken(response.access_token);
        localStorage.setItem('id_token', response.id_token);
        return response;
      })
  }

    //Flow Authorization code, get the token by authorization code
    async keycloakLogoutAuthCodeFlow(): Promise<any> {
  
      console.log('this.jwtPayload.id_token: '+this.jwtPayload.id_token)
      let id_token = localStorage.getItem('id_token') as string

      const logoutParams = new URLSearchParams({
        id_token_hint: id_token,
        post_logout_redirect_uri: "http://localhost:4200/keycloak/login"
      });

      this.clearToken();
  
      const url = `http://localhost:8080/realms/master/protocol/openid-connect/logout?${logoutParams.toString()}`;
      document.location.href = url;
    }
  


  // Verifica se a permissao contem nos authorities do toekn
  hasPermission(permission: string) {
    if (this.jwtPayload && this.jwtPayload.authorities)
      return this.jwtPayload.authorities.includes(permission);
    return false;
  }

  // Verifica se o token e valido
  isAccessTokenInvalid() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelperService.isTokenExpired(token);
  }

  // Remove o token do local storage
  clearToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  //Carrega o token do storage local
  private loadToken() {
    const token = localStorage.getItem('token');
    if (token)
      this.storeToken(token);
  }

  // Armazena o token no storage local e decodifica ele no jwtPayload
  private storeToken(token: string) {
    this.jwtPayload = this.jwtHelperService.decodeToken(token);
    console.log('jwtPayload: ' + JSON.stringify(this.jwtPayload))
    localStorage.setItem('token', token);
  }

}
