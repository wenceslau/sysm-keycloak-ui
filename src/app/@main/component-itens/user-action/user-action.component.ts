import { Component, Inject } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService, ServiceParameter } from '../../services/app.service';
import { HandlerService } from '../../services/handler.service';
import { Observable, Subscriber } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface UserAction {
  action: string;
  userUuid: string;
  actionAt: Date;
}


@Component({
  selector: 'app-user-action',
  templateUrl: './user-action.component.html',
  styleUrls: ['./user-action.component.scss']
})
export class UserActionComponent implements AfterViewInit {

  displayedColumns: string[] = ['action', 'userUuid', 'actionAt'];
  dataSource: any;

  selectedRowIndex:any;

  pageIndex = 0;
  pageSize = 10;
  length = 0;
  pageSizeOptions = [5, 10, 15, 20, 25];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public appService: AppService,
    public handler: HandlerService,
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
    parameters.url = "http://localhost:8083"

    parameters.path = "/user-action";

    this.appService.get(parameters, subscriber)
      .then(result => {
        this.dataSource = new MatTableDataSource<UserAction>(result.content);
        this.length = result.totalElements
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

  highlight(row: any){
    console.log(row)
    this.selectedRowIndex=row.id;
  }

}
