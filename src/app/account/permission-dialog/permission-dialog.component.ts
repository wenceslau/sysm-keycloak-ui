import { Component, Inject } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscriber } from 'rxjs';
import { AppService, HttpVerb, ServiceParameter } from 'src/app/@main/services/app.service';

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
    console.log(this.uuid);
    if (this.uuid) {
      this.getData();
    }
  }

  getData(subscriber?: Subscriber<any>) {
    const pars = new ServiceParameter();
    pars.path = "/permissions/" + this.uuid;
    let observable = this.appService.executeHttpRequest(HttpVerb.GET, pars, false);
    observable.subscribe({
      next: (data) => {
        console.log("data: " + data);
        this.formInput.patchValue(data);
        if (subscriber) subscriber.complete();
      },
      error: (err) => {
        console.log("error: " + err);
        if (subscriber) subscriber.complete();
      }
    });
  }

  save() {
    if (this.editing) {
      this.update();
    } else {
      this.insert();
    }
  }


  insert(subscriber?: Subscriber<any>) {
    const pars = new ServiceParameter();
    pars.path = "/permissions";
    pars.object = this.formInput.value;
    let observable = this.appService.executeHttpRequest(HttpVerb.POST, pars, false);
    observable.subscribe({
      next: (data) => {
        this.dialogRef.close(this.uuid);
        if (subscriber) subscriber.complete();
      },
      error: (err) => {
        console.log("error: " + err);
        if (subscriber) subscriber.complete();
      }
    });
  }

  update(subscriber?: Subscriber<any>) {
    const pars = new ServiceParameter();
    pars.path = "/permissions/" + this.uuid;
    pars.object = this.formInput.value;
    let observable = this.appService.executeHttpRequest(HttpVerb.PUT, pars, false);
    observable.subscribe({
      next: (data) => {
        console.log("data: " + data);
        this.dialogRef.close(this.uuid);
        if (subscriber) subscriber.complete();
      },
      error: (err) => {
        console.log("error: " + err);
        if (subscriber) subscriber.complete();
      }
    });
  }

  get editing() {
    return Boolean(this.formInput.value.uuid);
  }

}
