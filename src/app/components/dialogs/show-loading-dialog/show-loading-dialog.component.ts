import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-loading-dialog',
  templateUrl: './show-loading-dialog.component.html',
  styleUrls: ['./show-loading-dialog.component.css'],
})
export class ShowLoadingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ShowLoadingDialogComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close({ event: 'İptal' });
  }
}
