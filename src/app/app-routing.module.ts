import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './features/todo-list/todo-list.component';

const routes: Routes = [
  { path: 'todo-list', component: TodoListComponent },
  { path: '**', redirectTo: 'todo-list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
