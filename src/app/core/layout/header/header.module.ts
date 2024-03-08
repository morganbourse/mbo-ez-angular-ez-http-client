import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header.component';
import { TaskSearchComponent } from './task-search/task-search.component';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@NgModule({
  declarations: [
    TaskSearchComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MdbFormsModule,
    FormsModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
