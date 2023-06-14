import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


import { HandlerService } from './handler.service';

export class ServiceParameter {

  constructor() {
  }

  private _httpParams: HttpParams = new HttpParams();
  private _path: string;
  private _object: any;
  private _code: number;
  private _isBlob: Boolean

  get path(): string {
    return this._path;
  }

  set path(p: string) {
    this._path = p;
  }

  get object(): any {
    return this._object;
  }

  set object(p: any) {
    this._object = p;
  }

  get code(): number {
    return this._code;
  }

  set code(p: number) {
    this._code = p;
  }

  get isBlob(): Boolean {
    return this._isBlob;
  }

  set isBlob(p: Boolean) {
    this._isBlob = p;
  }


  get httpParams(): HttpParams {
    return this._httpParams;
  }

  set httpParams(p: HttpParams) {
    this._httpParams = p;
  }

  addParameter(key: string, value: any) {
    this._httpParams = this._httpParams.append(key, value);
  }

}

export enum HttpVerb {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _url = "http://localhost:8082"

  constructor(private http: HttpClient, private handler: HandlerService) {

  }

  executeHttpRequest(httoVerb: HttpVerb, paraeters: ServiceParameter, subscriber?: Subscriber<any>): Observable<any> {
    console.log("execute")
    let httpHeader = new HttpHeaders();
    httpHeader = httpHeader
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const url = this.url(paraeters);
    console.log(url);
    let http$;
    switch (httoVerb) {
      case HttpVerb.GET:
        http$ = this.http.get<any>(url, { headers: httpHeader, params: paraeters.httpParams });
        break;
      case HttpVerb.POST:
        http$ = this.http.post<any>(url, paraeters.object, { headers: httpHeader, params: paraeters.httpParams })
        break;
      case HttpVerb.PUT:
        http$ = this.http.put<any>(url, paraeters.object, { headers: httpHeader, params: paraeters.httpParams })
        break;
      case HttpVerb.PATCH:
        http$ = this.http.put<any>(url, paraeters.object, { headers: httpHeader, params: paraeters.httpParams })
        break;
      case HttpVerb.DELETE:
        http$ = this.http.delete<any>(url, { headers: httpHeader, params: paraeters.httpParams })
        break;
    }

    http$.pipe(retry(0)).subscribe({
      // next(data) {
      //   console.log('>>>>>'+ new Date())
      //   if (subscriber) subscriber.next("class app service");
      //   return data;
      // },
      error: (err) => {
        console.log('Error' + err)
        if (subscriber) subscriber.complete();
        this.handleError(err);
      },
    });

    return http$;
  }

  get(paraeters: ServiceParameter, subscriber?: Subscriber<any>): Observable<any> {
    console.log("Get")
    return this.executeHttpRequest(HttpVerb.GET, paraeters, subscriber);
  }
  post(paraeters: ServiceParameter, subscriber?: Subscriber<any>): any {
    return this.executeHttpRequest(HttpVerb.POST, paraeters, subscriber);
  }
  put(paraeters: ServiceParameter, subscriber?: Subscriber<any>): any {
    return this.executeHttpRequest(HttpVerb.PUT, paraeters, subscriber);
  }
  patch(paraeters: ServiceParameter, subscriber?: Subscriber<any>): any {
    return this.executeHttpRequest(HttpVerb.PATCH, paraeters, subscriber);
  }
  delete(paraeters: ServiceParameter, subscriber?: Subscriber<any>): any {
    return this.executeHttpRequest(HttpVerb.DELETE, paraeters, subscriber);
  }

  private url(pars: ServiceParameter): string {
    let path = this._url;

    if (pars.path != null)
      path += '' + pars.path;

    if (pars.code != null)
      path += '/' + pars.code;

    return path;
  }

  private handleError(error: any) {
    let errorMessage = JSON.stringify(error);
    console.log(errorMessage)

    if (error.error) {
      errorMessage = error.error.message;

    } else {
      errorMessage = error.error.error_description;

    }

    console.log(errorMessage)
    this.handler.addSnackBarError(errorMessage)

    return throwError(() => {
      return errorMessage;

    });
  }

}
