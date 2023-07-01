import { Component, Inject } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscriber } from 'rxjs';
import { AppService, HttpVerb, ServiceParameter } from 'src/app/@main/services/app.service';
import { HandlerService } from 'src/app/@main/services/handler.service';

export interface Permission {
  uuid: string;
  role: string;
  description: number;
}

@Component({
  selector: 'app-permission-dialog',
  templateUrl: './permission-dialog.component.html',
  styleUrls: ['./permission-dialog.component.scss']
})
export class PermissionDialogComponent implements AfterViewInit {

  formInput: FormGroup;

  constructor(
    public appService: AppService,
    public handler: HandlerService,
    public dialogRef: MatDialogRef<PermissionDialogComponent>,
    private formBuild: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public uuid: string) {

    this.formInput = this.formBuild.group({
      uuid: [null],
      role: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

  }

  ngAfterViewInit() {
    if (this.uuid) {
      this.httpFind();
    }
  }

  save() {
    if (this.editing) {
      this.httpUpdate();
    } else {
      this.httpInsert();
    }
  }
  
  get editing() {
    return Boolean(this.formInput.value.uuid);
  }

    
  get title() {
   if (this.editing){
    return "Permission - Edit" 
   }
   return "Permission - New" 

  }

  private httpFind(subscriber?: Subscriber<any>) {
    this.handler.loading()
    const pars = new ServiceParameter();
    pars.path = "/permissions/" + this.uuid;

    this.appService.get(pars, subscriber)
      .then(result => {
        this.formInput.patchValue(result);
      }).catch(err => {
        this.handler.throwError(err)
      }).finally( ()=> {
        this.handler.loading()
        subscriber?.complete();
      })
  }

  private httpInsert(subscriber?: Subscriber<any>) {
    this.handler.loading()
    const pars = new ServiceParameter();
    pars.path = "/permissions";
    pars.object = this.formInput.value;

    this.appService.post(pars, subscriber)
      .then(result => {
        this.dialogRef.close(this.uuid);
        this.handler.addSnackBarInfo("Record has been saved successfully")
      }).catch(err => {
        this.handler.throwError(err)
      }).finally( ()=> {
        this.handler.loading()
        subscriber?.complete();
      })
  }

  private httpUpdate(subscriber?: Subscriber<any>) {
    this.handler.loading()

    const pars = new ServiceParameter();
    pars.path = "/permissions/" + this.uuid;
    pars.object = this.formInput.value;

    this.appService.put(pars, subscriber)
      .then(result => {
        this.dialogRef.close(this.uuid);
        this.handler.addSnackBarInfo("Record has been saved successfully")
      }).catch(err => {
        this.handler.throwError(err)
      }).finally( ()=> {
        this.handler.loading()
        subscriber?.complete();
      })

  }


}
