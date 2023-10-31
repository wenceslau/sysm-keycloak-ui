import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, lastValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizerService {

  //authcode, implicit, hybrid, resource
  authFlow: string = 'authcode'
  clientId: string = 'wban-client'
  jwtPayload: any;

  constructor(private http: HttpClient,
              private jwtHelperService: JwtHelperService,
              private cookieService: CookieService) {
    this.loadToken();
  }

  //Flow Authorization code, get the token by authorization code
  async loginResourceFlow(username: string, password: string): Promise<any> {

    const loginParams = new URLSearchParams({
      client_id: this.clientId,
      grant_type: 'password',
      scope: "openid",
      username: username,
      password: password
    });

    const body = loginParams.toString();
    const oauthUrl = 'http://localhost:8080/realms/master/protocol/openid-connect/token';

    let source$ = this.post(body, oauthUrl);

    return await lastValueFrom(source$)
      .then(response => {
        console.log(response);
        let value = response as any;
        this.storeToken(value.access_token, 'token');
        this.store(value.id_token, 'idtoken');
        this.store(value.refresh_token, 'refreshtoken');
        return response;
      });
  }

  //Flow Authorization code, get the token by authorization code
  async loginAuthCodeFlow(authCode: string): Promise<any> {

    const loginParams = new URLSearchParams({
      client_id: this.clientId,
      grant_type: 'authorization_code',
      redirect_uri: "http://localhost:4200/keycloak/callback",
      code: authCode
    });

    const body = loginParams.toString();
    const oauthUrl = 'http://localhost:8080/realms/master/protocol/openid-connect/token';

    let source$ = this.post(body, oauthUrl);
    return await lastValueFrom(source$)
      .then(response => {
        console.log(response);
        let value = response as any;
        this.storeToken(value.access_token, 'token');
        this.store(value.id_token, 'idtoken');
        this.store(value.refresh_token, 'refreshtoken');
        return response;
      });
  }

  async logoutResourceFlow() {
    console.log('logoutResourceFlow')
    const oauthUrl = 'http://localhost:8080/realms/master/protocol/openid-connect/revoke';

    let token = this.retrieve('token');
    let loginParams = new URLSearchParams({
      client_id: this.clientId,
      token: token
    });
    let body = loginParams.toString();
    this.post(body, oauthUrl);

    token = this.retrieve('refreshtoken');
    loginParams = new URLSearchParams({
      client_id: this.clientId,
      token: token
    });
    body = loginParams.toString();

    this.clearToken();
    let source$ =  this.post(body, oauthUrl);

    return await lastValueFrom(source$)
    .then(response => {
      console.log(response);
      return response;
    });
  }

  async logoutAuthCodeFlow() {
    console.log('logoutAuthCodeFlow')

    let id_token = this.retrieve('idtoken') as string
    //alert('ID:...'+id_token)
    const logoutParams = new URLSearchParams({
      client_id: "wban-client", // if  I send this value, keycloak will ask user to confirm logout
      id_token_hint: id_token,
      post_logout_redirect_uri: "http://localhost:4200/keycloak/login"
    });

    const url = `http://localhost:8080/realms/master/protocol/openid-connect/logout?${logoutParams.toString()}`;

    this.clearToken();
    document.location.href = url;
  }

  async logoutImplictyFlow() {
    console.log('logoutAuthImplicty')

    let id_token = this.retrieve('idtoken') as string
    const logoutParams = new URLSearchParams({
      client_id: "wban-client", // if  I send this value, keycloak will ask user to confirm logout
      id_token_hint: id_token,
      post_logout_redirect_uri: "http://localhost:4200/keycloak/login"
    });

    const url = `http://localhost:8080/realms/master/protocol/openid-connect/logout?${logoutParams.toString()}`;

    this.clearToken();
    document.location.href = url;
  }

  hasPermission(permission: string) {
    if (this.jwtPayload && this.jwtPayload.realm_access) {
      let obj = this.jwtPayload.realm_access;
      return obj.roles.includes(permission);
    }
    return false;
  }

  isAccessTokenInvalid() {
    const token = this.retrieve('token');
    return !token || this.jwtHelperService.isTokenExpired(token);
  }

  clearToken() {
    this.remove('token');
    this.remove('idtoken');
    this.remove('refreshtoken');
    this.jwtPayload = null;
  }

  storeToken(value: any, name: string) {
    if (value){
      this.jwtPayload = this.jwtHelperService.decodeToken(value);
      console.log('jwtPayload: ' + JSON.stringify(this.jwtPayload))
    }
    this.store(value, name);
  }

  store(value: any, name: string) {
    localStorage.setItem(name, value);
    //this.cookieService.set(name, value);
  }

  retrieve(name: string): string {
    return localStorage.getItem(name) as string;
   // return this.cookieService.get(name);
  }

  private loadToken() {
    const token = localStorage.getItem('token');
    if (token)
      this.storeToken(token, 'token');
  }

  private remove(name: string) {
    localStorage.removeItem(name);
    //this.cookieService.delete(name)
  }

  private post(body: string, oauthUrl: string): Observable<any> {
    this.clearToken();

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let observable: Observable<any>;
    observable = this.http.post<any>(oauthUrl, body, { headers, withCredentials: true });

    return observable.pipe();
  }

  //Deprected
  private async login(email: string, password: string): Promise<any> {
    this.clearToken();

    let oauthTokenUrl = 'http://localhost:8081/oauth/token'
    let headers = new HttpHeaders();

    // enviado como post, preciso do content typ para ler o body como um query string
    headers = headers
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic d2ViOkB3ZWIxMjM=');

    const body = `username=${email}&password=${password}&grant_type=password`;

    let observable: Observable<any>;
    observable = this.http.post<any>(oauthTokenUrl, body, { headers, withCredentials: true })
    const source$ = observable.pipe();

    return await lastValueFrom(source$)
      .then(response => {
        this.storeToken(response.access_token, 'token');
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

}
