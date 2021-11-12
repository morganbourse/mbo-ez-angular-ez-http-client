import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HeaderComponent } from './header.component';
import { TaskSearchComponent } from './task-search/task-search.component';

@NgModule({
  declarations: [
    TaskSearchComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MDBBootstrapModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
