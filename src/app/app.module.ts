import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { TodolistService } from './services/todolist.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ShowLoadingDialogComponent } from './components/dialogs/show-loading-dialog/show-loading-dialog.component';
import { DialogService } from './services/dialog.service';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    ShowLoadingDialogComponent
  ],
  entryComponents: [ShowLoadingDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatListModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule
  ],
  providers: [TodolistService, DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
