import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

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

  constructor(private http: HttpClient) { }

  executeHttpRequest(verb: HttpVerb, pars: ServiceParameter, block: boolean): Observable<any> {
    let httpHeader = new HttpHeaders();
    httpHeader = httpHeader
    .append('Content-Type', 'application/json')
    .append('Authorization', 'Bearer '+localStorage.getItem('token'));
    const url = this.url(pars);
    console.log(url);
    switch (verb) {
      case HttpVerb.GET:
        return this.http
          .get<any>(url, { headers: httpHeader, params: pars.httpParams })
          .pipe(retry(1), catchError(this.handleError));
      case HttpVerb.POST:
        return this.http
          .post<any>(url, pars.object, { headers: httpHeader, params: pars.httpParams })
          .pipe(retry(1), catchError(this.handleError));
      case HttpVerb.PUT:
        return this.http
          .put<any>(url, pars.object, { headers: httpHeader, params: pars.httpParams })
          .pipe(retry(1), catchError(this.handleError));
      case HttpVerb.PATCH:
        return this.http
          .put<any>(url, pars.object, { headers: httpHeader, params: pars.httpParams })
          .pipe(retry(1), catchError(this.handleError));
      case HttpVerb.DELETE:
        return this.http
          .delete<any>(url, { headers: httpHeader, params: pars.httpParams })
          .pipe(retry(1), catchError(this.handleError));
      default:
        return new Observable();
    }
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
    console.log(error)
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}\nDescription ${error.error.error_description}`;
    }
    //window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

}
