import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from '../app-routing.module';
import { TodoListComponent } from './todo-list/todo-list.component';
import { SaveOrUpdateTaskPopupComponent } from './todo-list/save-or-update-task-popup/save-or-update-task-popup.component';
import { ImportTasksPopupComponent } from './todo-list/import-tasks-popup/import-tasks-popup.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@NgModule({
  declarations: [
      TodoListComponent,
      SaveOrUpdateTaskPopupComponent,
      ImportTasksPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    MdbModalModule,
    MdbRippleModule,
    MdbFormsModule,
    NgxPaginationModule
  ],
  exports: [RouterModule]
})
export class FeaturesModule { }
