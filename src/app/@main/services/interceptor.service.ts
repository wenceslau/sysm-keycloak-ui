import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler):   Observable<HttpEvent<any>>
}

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{
  constructor() { }

  handleError(error: HttpErrorResponse){
    console.log("lalalalalalalala");
    return throwError(() => error); // throwError(error);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>>{
    return next.handle(req)
      .pipe(
        catchError(this.handleError)
      )
  };
}

