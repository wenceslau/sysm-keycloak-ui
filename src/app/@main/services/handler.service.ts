import { Injectable } from '@angular/core';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthorizerService } from 'src/app/security/authorizer.service';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  isLoadingResults = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  duration: number = (10 * 1000);

  constructor(private snackBar: MatSnackBar, private auth: AuthorizerService) {
  }

  getError(err: any): string {
    console.log('Error...: ' + err)
    console.error('Error...: ' + err)
    console.log('Error...' +JSON.stringify(err))
    let errorMessage;

    errorMessage = err?.error?.message;
    if (errorMessage)
      return errorMessage;

    errorMessage = err?.message
    if (errorMessage)
      return errorMessage;

    if (errorMessage == 'invalid_grant' || errorMessage == 'unauthorized')
      errorMessage = "User or password invalid"

    return JSON.stringify(err);
  }

  throwError(err: any): string {
    let errorMsg = this.getError(err)
    this.addSnackBarError(errorMsg)
    return err;
  }

  addSnackBarError(message: string) {
    this.snackBar.open(message, ":( Ops", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: 'main-snackbar-error',
      duration: this.duration,
    });
  }

  addSnackBarInfo(message: string) {
    this.snackBar.open(message, ":) OK", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: 'main-snackbar-info',
      duration: this.duration
    });
  }

  loading(): boolean {
    this.isLoadingResults = !this.isLoadingResults;
    return this.isLoadingResults;
  }

  usernameLogged(): string {
    if (this.auth.jwtPayload) {
      return this.auth.jwtPayload.preferred_username;
    }
    return ''
  }

  nameLogged(): string {
    if (this.auth.jwtPayload) {
      return this.auth.jwtPayload.name;
    }
    return ''
  }
}
