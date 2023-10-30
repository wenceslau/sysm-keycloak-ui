import {Component} from '@angular/core';
import {AppService, Service, ServiceParameter} from "../../@main/services/app.service";
import {HandlerService} from "../../@main/services/handler.service";
import {Subscriber} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {

  selectedValue: any;
  visible: boolean = false;

  formInput: FormGroup;

  constructor(
    private formBuild: FormBuilder,
    private appService: AppService,
    public handler: HandlerService
  ) {
    this.formInput = this.formBuild.group({
      uuid: [null],
      name: [null, [Validators.required]],
      displayName: [null, [Validators.required]],
      license: [null, [Validators.required]],
    });
  }

  ngAfterViewInit() {

  }


  openDialog() {
    this.visible = true;
  }

  reset() {

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

  private httpFind(subscriber?: Subscriber<any>) {
    this.handler.loading()
    const pars = new ServiceParameter();
    pars.path = "/applications/" + this.selectedValue;

    this.appService.get(pars, Service.CORE, subscriber)
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
    pars.path = "/applications";
    pars.object = this.formInput.value;

    this.appService.post(pars, Service.CORE, subscriber)
      .then(result => {
        this.handler.addSnackBarInfo("Record has been saved successfully")

      }).catch(err => {
        this.handler.throwError(err)

    }).finally( ()=> {
      this.visible = false;
      this.handler.loading()
      subscriber?.complete();

    })
  }

  private httpUpdate(subscriber?: Subscriber<any>) {
    this.handler.loading()

    const pars = new ServiceParameter();
    pars.path = "/applications/" + this.formInput.value.uuid;
    pars.object = this.formInput.value;

    this.appService.put(pars, Service.CORE, subscriber)
      .then(result => {
        this.handler.addSnackBarInfo("Record has been saved successfully")

      }).catch(err => {
        this.handler.throwError(err)

    }).finally( ()=> {
      this.handler.loading()
      subscriber?.complete();

    })

  }



}
