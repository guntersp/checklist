import { Component } from '@angular/core';
import { AppService } from './app.service';
import { QrcodeDialogComponent } from './qrcode-dialog/qrcode-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public readonly appService: AppService,
    public readonly dialog: MatDialog
  ) { }

  showLink() {
    const dialogRef = this.dialog.open(QrcodeDialogComponent, {
      data: { url: window.location.href },
    });

    dialogRef.afterClosed().subscribe(() => {
      //console.log('The dialog was closed');
      //this.animal = result;
    });
  }
}
