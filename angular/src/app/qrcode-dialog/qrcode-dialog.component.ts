import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../app.service';

export interface DialogData {
  url: string;
}

@Component({
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrls: ['./qrcode-dialog.component.scss']
})
export class QrcodeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<QrcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public readonly appService: AppService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public get width(): number {
    return Math.min(500, document.body.clientWidth * 0.8)
  }
}
