import {Component, OnInit, ViewChild} from '@angular/core';
import {ClientService} from './services/client.service';
import {finalize} from 'rxjs/operators';
import {IClient} from './interfaces/clients.interface';
import {DataSource} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {CreateEditUserComponent} from './components/create-edit-user/create-edit-user.component';
import {MODES} from './constants/clients.constant';
import {ConfirmDialogComponent} from './components/confirm-dialog/confirm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Bank App';
  public loading: boolean;
  public clients: IClient[] = [];
  public displayedColumns = [
    'firstName', 'lastName',  'sex', 'mobilePhone', 'currentCity', 'actions'
  ];
  public dataSource = new MatTableDataSource<IClient>();

  @ViewChild(MatSort, {static: false}) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator, {static: false}) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(private readonly clientService: ClientService,
              private readonly snackBar: MatSnackBar,
              private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.setDataSortAccessor();
    this.getClients();
  }

  private getClients(): void {
    this.loading = true;
    this.clientService.getClients()
    .pipe(finalize(() => this.loading = false))
    .subscribe(clients => {
      this.clients = clients;
      this.dataSource.data = this.clients;
    });
  }

  public openAddClientModal(): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      width: '650px',
      data: {
        mode: MODES.CREATE,
      }
    });

    dialogRef.afterClosed()
    .subscribe((created) => {
      if (created) {
        this.getClients();
      }
    });
  }

  public deleteClient(client: IClient): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: client,
      width: '600px'
    });

    dialogRef.afterClosed()
    .subscribe(confirmed => {
      if (confirmed) {
        this.clientService.deleteClient(client._id)
        .subscribe(() => {
          this.clients = this.clients.filter(item => item._id !== client._id);
          this.dataSource.data = this.clients;
          this.snackBar.open('Аккаунт удалён', null, { duration: 3000 } );
        });
      }
    });
  }

  public openInfo(client: IClient): void {
    this.dialog.open(CreateEditUserComponent, {
      width: '650px',
      data: {
        mode: MODES.INFO,
        client
      }
    });
  }

  trackBy(index: number, item: IClient): string {
    return item?._id || index.toString();
  }

  public editUser(client: IClient): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      width: '650px',
      data: {
        mode: MODES.EDIT,
        client
      }
    });

    dialogRef.afterClosed()
    .subscribe(user => {
      if (user) {
        this.clients = this.clients.map(item => item._id === user._id ? user : item);
        this.dataSource.data = this.clients;
      }
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private setDataSortAccessor(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      console.log(item[property]);
      switch (property) {
        case 'lastName': {
          return item.lastName.toLowerCase();
        }
        case 'passportSeries': {
          return item.passportSeries.toLowerCase();
        }
        case 'sex': {
          return item.sex;
        }
      }
    };
  }
}
