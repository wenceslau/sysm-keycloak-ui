import { Injectable } from '@angular/core';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  duration: number = (5 * 1000);

  constructor(private snackBar: MatSnackBar) { }

  addSnackBarError(message: string) {
    this.snackBar.open(message, ":( Ops", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: 'main-snackbar-error',
      duration: this.duration
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
}
