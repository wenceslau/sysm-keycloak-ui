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

  // Verifica se a permissao contem nos authorities do toekn
  hasPermission(permission: string) {
    if (this.jwtPayload)
      return this.jwtPayload && this.jwtPayload.authorities.includes(permission);
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
    localStorage.setItem('token', token);
  }

}
