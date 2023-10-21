import { NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ChecklistComponent } from './checklist/checklist.component';
import { AppService } from './app.service';
import { MarkdownModule } from 'ngx-markdown';
import { MarkdownComponent } from './markdown/markdown.component';
import { CheckpointComponent } from './checkpoints/checkpoint.component';
import { QrcodeDialogComponent } from './qrcode-dialog/qrcode-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ListAllComponent } from './list-all/list-all.component'

@NgModule({
  declarations: [
    AppComponent,
    ChecklistComponent,
    MarkdownComponent,
    CheckpointComponent,
    QrcodeDialogComponent,
    ListAllComponent
  ],
  imports: [
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTabsModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatButtonModule,
    QRCodeModule
  ],
  providers: [
    AppService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
