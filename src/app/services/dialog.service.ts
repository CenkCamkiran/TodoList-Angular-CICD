import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShowLoadingDialogComponent } from '../components/dialogs/show-loading-dialog/show-loading-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private LoadingDialog!: MatDialogRef<ShowLoadingDialogComponent>;

  constructor(private dialog: MatDialog) { }

  CloseDialog(): void {
    this.LoadingDialog.close();
  }

  ShowLoadingScreen(): void {
    this.LoadingDialog = this.dialog.open(ShowLoadingDialogComponent, {
      disableClose: false,
    });
  }

}