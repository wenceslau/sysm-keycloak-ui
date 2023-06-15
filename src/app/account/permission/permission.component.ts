import { Component } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscriber } from 'rxjs';
import { AppService, HttpVerb, ServiceParameter } from 'src/app/@main/services/app.service';
import { PermissionDialogComponent } from '../permission-dialog/permission-dialog.component';
import { HandlerService } from 'src/app/@main/services/handler.service';

export interface Permission {
  uuid: string;
  role: string;
  description: number;
}

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent implements AfterViewInit {

  displayedColumns: string[] = ['actions', 'id', 'role', 'description'];
  dataSource: any;

  pageIndex = 0;
  pageSize = 10;
  length = 0;
  pageSizeOptions = [5, 10, 15, 20, 25];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoadingResults = true;
  selectedValue: string;
  valueFilter: string;

  constructor(
    public appService: AppService,
    public dialog: MatDialog,
    public handler: HandlerService) {
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

  openDialog(uuid: string) {

    const dialogRef = this.dialog.open(PermissionDialogComponent, {
      data: uuid,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed result: ${result}`);
      this.paginator.firstPage();
      this.getData(0, this.pageSize);
    });
  }

  reset() {
    this.selectedValue = '';
    this.getData(0, this.pageSize);
    this.paginator.firstPage();
  } 

  getData(pageIndex: number, pageSize: number, subscriber?: Subscriber<any>) {
    const parameters = new ServiceParameter();
    parameters.addParameter("page", pageIndex);
    parameters.addParameter("size", pageSize);
    if (this.selectedValue && this.valueFilter) {
      parameters.addParameter(this.selectedValue, this.valueFilter);
    }
    parameters.path = "/permissions";

    this.appService.get(parameters, subscriber)
      .then(result => {
        this.dataSource = new MatTableDataSource<Permission>(result.content);
        this.length = result.totalElements
        this.isLoadingResults = false;
      }).catch(err => {
        this.handler.error(err)
      }).finally( ()=> {
        subscriber?.complete();
      })
  }

  loadData(event: PageEvent) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getData(this.pageIndex, this.pageSize);
  }
}
