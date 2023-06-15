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
      this.find();
    }
  }

  save() {
    if (this.editing) {
      this.update();
    } else {
      this.insert();
    }
  }

  private find(subscriber?: Subscriber<any>) {
    const pars = new ServiceParameter();
    pars.path = "/permissions/" + this.uuid;

    this.appService.get(pars, subscriber)
      .then(result => {
        this.formInput.patchValue(result);
      }).catch(err => {
        this.handler.error(err)
      }).finally( ()=> {
        subscriber?.complete();
      })
  }

  private insert(subscriber?: Subscriber<any>) {
    const pars = new ServiceParameter();
    pars.path = "/permissions";
    pars.object = this.formInput.value;

    this.appService.post(pars, subscriber)
      .then(result => {
        this.dialogRef.close(this.uuid);
        this.handler.addSnackBarInfo("Record has been saved successfully")
      }).catch(err => {
        this.handler.error(err)
      }).finally( ()=> {
        subscriber?.complete();
      })
  }

  private update(subscriber?: Subscriber<any>) {
    const pars = new ServiceParameter();
    pars.path = "/permissions/" + this.uuid;
    pars.object = this.formInput.value;

    this.appService.put(pars, subscriber)
      .then(result => {
        this.dialogRef.close(this.uuid);
        this.handler.addSnackBarInfo("Record has been saved successfully")
      }).catch(err => {
        this.handler.error(err)
      }).finally( ()=> {
        subscriber?.complete();
      })

  }

  get editing() {
    return Boolean(this.formInput.value.uuid);
  }

}
