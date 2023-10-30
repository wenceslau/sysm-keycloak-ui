import {Component} from '@angular/core';
import {AppService, Service, ServiceParameter} from "../../@main/services/app.service";
import {HandlerService} from "../../@main/services/handler.service";
import {Observable, Subscriber} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LazyLoadEvent, MenuItem} from "primeng/api";

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {

  selectedValue: any;
  valueFilter: any;
  visible: boolean = false;

  applications: any[];
  totalRecords: number;
  pageSize = 8;
  loading = true;

  items: MenuItem[];

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
    this.httpList(0);

    this.items = [
      {
        icon: 'pi pi-pencil',
        command: () => {
          this.edit();
        }
      },
      {
        icon: 'pi pi-upload',
        command: () => {
          this.edit();
        }
      },
    ];
  }

  reset() {
    this.valueFilter = '';
    this.httpList(0)
  }

  filter(){
    this.httpList(0)
  }

  new() {
    this.formInput.reset()
    this.visible = true;
  }

  edit() {
    this.visible = true;
    this.httpFind()
  }

  save() {
    if (this.editing) {
      this.httpUpdate();
    } else {
      this.httpInsert();
    }
  }

  onClickSpeedDial(value: any ){
    this.selectedValue = value;
  }





  loadData(event: any) {
    this.loading = true;
    let page = (event.first as number) / (event.rows as number);

    let observable = new Observable(sub => {
      this.httpList(page, sub)
    });
    observable.subscribe({
      complete: () => {
        this.loading = false;
        console.log('Data loaded')
      }
    });
  }

  get editing() {
    return Boolean(this.formInput.value.uuid);
  }

  private httpFind(subscriber?: Subscriber<any>) {
    this.handler.loading()
    const pars = new ServiceParameter();
    pars.path = "/applications/" + this.selectedValue.uuid;
    console.log(pars.path)

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
        this.httpList(0)
        this.visible = false;
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
    pars.path = "/applications/" + this.formInput.value.uuid;
    pars.object = this.formInput.value;

    this.appService.put(pars, Service.CORE, subscriber)
      .then(result => {
        this.httpList(0)
        this.visible = false;
        this.handler.addSnackBarInfo("Record has been saved successfully")

      }).catch(err => {
        this.handler.throwError(err)

    }).finally( ()=> {
      this.handler.loading()
      subscriber?.complete();

    })
  }

  private httpList(pageIndex: number,subscriber?: Subscriber<any>) {
    this.handler.loading();
    const parameters = new ServiceParameter();
    parameters.addParameter("page", pageIndex);
    parameters.addParameter("size", this.pageSize);
    parameters.path = "/applications";

    //Filter parameter
    if (this.valueFilter) {
      parameters.addParameter("name", this.valueFilter);
    }

    this.appService.get(parameters, Service.CORE, subscriber)
      .then(result => {
        this.applications = result.content;
        this.totalRecords = result.totalElements

      }).catch(err => {
        this.handler.throwError(err)

    }).finally(() => {
      this.handler.loading();
      subscriber?.complete();

    })
  }

}
