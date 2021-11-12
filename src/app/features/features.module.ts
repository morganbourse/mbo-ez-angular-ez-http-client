import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardsModule, MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from '../app-routing.module';
import { TodoListComponent } from './todo-list/todo-list.component';
import { SaveOrUpdateTaskPopupComponent } from './todo-list/save-or-update-task-popup/save-or-update-task-popup.component';

@NgModule({
  declarations: [
      TodoListComponent,
      SaveOrUpdateTaskPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CardsModule,
    AppRoutingModule,
    MDBBootstrapModule,
    NgxPaginationModule
  ],
  exports: [RouterModule]
})
export class FeaturesModule { }
