import { Component, Inject } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {AppService, Service, ServiceParameter} from '../../services/app.service';
import { HandlerService } from '../../services/handler.service';
import { Observable, Subscriber } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScrollDispatcher } from '@angular/cdk/scrolling';


export interface UserAction {
  action: string;
  userUuid: string;
  actionAt: Date;
  objectValue: string;
}

export class JsonObject {
  column: string;
  value: any;
}


@Component({
  selector: 'app-user-action',
  templateUrl: './user-action.component.html',
  styleUrls: ['./user-action.component.scss']
})
export class UserActionComponent implements AfterViewInit {

  displayedColumns: string[] = ['action', 'userUuid', 'actionAt'];
  dataSource: any;
  columnsJsonObject: string[] = ['column', 'value'];
  dataJsonObject: any;

  selectedRowIndex: any;
  selectedRow: any;


  pageIndex = 0;
  pageSize = 9;
  length = 0;
  pageSizeOptions = [9, 13, 17, 21, 25];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public appService: AppService,
    public handler: HandlerService,
    private scrollDispatcher: ScrollDispatcher,
    @Inject(MAT_DIALOG_DATA) public uuid: string) {

  }

  ngAfterViewInit() {
    let subscriber: Subscriber<any>;
    let observable = new Observable(sub => {
      subscriber = sub;
      this.getData(0, this.pageSize, subscriber)
    });
    observable.subscribe({
      complete: () => {
      }
    });
  }

  getData(pageIndex: number, pageSize: number, subscriber?: Subscriber<any>) {
    this.handler.loading();
    const parameters = new ServiceParameter();
    parameters.addParameter("page", pageIndex);
    parameters.addParameter("size", pageSize);
    parameters.addParameter("objectUuid", this.uuid);
    parameters.addParameter("service", "suite-core");
    parameters.addParameter("objectName", "PermissionModel");
    parameters.path = "/user-action";

    this.appService.get(parameters, Service.AUDIT, subscriber)
      .then(result => {
        this.dataSource = new MatTableDataSource<UserAction>(result.content);
        this.length = result.totalElements
        if (this.dataSource.data) {
          this.onRowSelect(this.dataSource.data[0])
        }
      }).catch(err => {
        this.handler.throwError(err)
      }).finally(() => {
        this.handler.loading();
        subscriber?.complete();
      })
  }

  loadData(event: PageEvent) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getData(this.pageIndex, this.pageSize);
  }

  onRowSelect(row: any) {
    this.selectedRow = row;
    this.selectedRowIndex = row.id
    this.getDataJsonObject(row);
  }

  private getDataJsonObject(data: UserAction) {
    let values: JsonObject[] = []
    try {
      let json = JSON.parse(data.objectValue);

      for (let prop in json) {
        // if (prop === 'ID')
        //   continue;
        let val = json[prop];
        if (typeof val === 'object') {
          val = this.getValueProperity(val);
        }
        values.push({ column: prop, value: val });
      }

      values = values.sort((one, two) => (one.column.toUpperCase() < two.column.toUpperCase() ? -1 : 1));
    } catch (e) {
      values.push({ column: 'Message', value: data.objectValue });
    }
    this.dataJsonObject = new MatTableDataSource<JsonObject>(values);
  }

  private getValueProperity(json: any) {
    if (json === null) {
      return '';
    }

    if (this.hasPropertie(json, 'uuid')) {
      return json['uuid'];
    }

    if (this.hasPropertie(json, 'id')) {
      return json['id'];
    }

    let prop = this.hasPropertieStartWith(json, 'id', 2)
    if (prop) {
      return json[prop];
    }

    prop = this.hasPropertieStartWith(json, 'nom', 3)
    if (prop) {
      return json[prop];
    }

    return this.getValueList(json);

  }

  private hasPropertie(json: any, column: string): boolean {
    for (let prop in json) {
      if (prop === column) {
        if (json[prop] !== null) {
          return true;
        }
      }
    }
    return false;
  }

  private hasPropertieStartWith(json: any, column: string, len: number): string {
    for (let prop in json) {
      if (prop.length >= len) {
        if (prop.substring(0, len) === column) {
          return prop;
        }
      }
    }
    return '';
  }

  private getValueList(json: any): string {
    let value = [];
    value = json;
    let code = '';
    if (Array.isArray(value))
      value.forEach(element => {
        if (this.hasPropertie(element, 'uuid')) {
          code = code + ' ' + element['uuid'];
        }
        if (this.hasPropertie(element, 'id')) {
          code = code + ' ' + element['id'];
        }
      });
    return code;
  }

}
