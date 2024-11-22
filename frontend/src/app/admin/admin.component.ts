import { Component } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { Observable } from 'rxjs';
import { ShareDTO } from '../../dtos/share-dto';
import { MatToolbar, MatToolbarModule, MatToolbarRow } from '@angular/material/toolbar';
import { AuthService } from '../services/auth-service/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatGridList, MatGridListModule, MatGridTile, MatGridTileText } from '@angular/material/grid-list';
import { MatList, MatListItem, MatListItemIcon, MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddShareComponent } from './add-share/add-share.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIcon,
    MatButton,
    MatIconButton,
    MatGridList,
    MatGridTile,
    MatGridTileText,
    MatList,
    MatListItem,
    MatListItemIcon,
    CommonModule,
    MatDivider,
    MatTableModule,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    RouterModule,
    MatFabButton,
    MatDialogModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  public sharesTable = new MatTableDataSource()

  public displayedColumns = ["expiry", "shortuuid"]

  constructor(
    private _apiService: ApiService,
    private _authService: AuthService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this._apiService.getShares().subscribe(result => {
      this.sharesTable.data = result
      console.log(result)
    })
  }

  logout(): void {
    this._authService.logout();
  }

  delete(share: ShareDTO): void {
    this._apiService.deleteShare(share).subscribe(() => {

      this.refreshData()
    })
  }

  openAddDialog(): void {
    var ref = this._dialog.open(AddShareComponent, {
      height: '400px',
      width: '600px',
    })

    ref.afterClosed().subscribe(res => {
      this.refreshData()
    })
  }

}
