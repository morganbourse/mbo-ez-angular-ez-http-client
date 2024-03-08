import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/core/models/page.model';
import { Task } from 'src/app/core/models/tasks/task.model';
import { TaskService } from 'src/app/core/services/task.service';
import { TaskSearchNotifyService } from 'src/app/core/layout/header/task-search/services/task-search-notifier.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Search } from 'src/app/core/layout/header/task-search/models/search.model';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SaveOrUpdateTaskPopupComponent } from './save-or-update-task-popup/save-or-update-task-popup.component';
import { ImportTasksPopupComponent } from './import-tasks-popup/import-tasks-popup.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  private searchSubscription: Subscription | undefined;

  tasksPage?: Page<Task>;
  sort: Array<string> = [];
  page = 1;
  rowCount = 10;
  search: Search | undefined;
  taskToUpdate?: Task;

  constructor(
    private todoListService: TaskService,
    private taskSearchNotifyService: TaskSearchNotifyService,
    private notifyService: ToastService,
    private modalService: MdbModalService
  ) { }

  public ngOnInit(): void {
    this.searchSubscription = this.taskSearchNotifyService.subscribe(search => {
      this.search = search;
      this.reloadTasks();
    });

    this.reloadTasks();
  }

  public ngOnDestroy(): void {
    if (this.searchSubscription && !this.searchSubscription.closed) {
      this.searchSubscription.unsubscribe();
    }
  }

  public updateState(task: Task, $event: Event): void {
    console.log(`Update id ${task.id}`);
    const checked: boolean = ($event.target! as HTMLInputElement).checked;
    this.todoListService.updateTaskState(task.id, { done: checked }).then(() => {
      task.done = checked;
      this.notifyService.success(`Task "${task.name}" marked as ${checked ? 'done' : 'todo'} !`, 'Update successful');
    }).catch((error) => {
      console.error(error);
      this.notifyService.error(`Error pending mark task "${task.name}" as ${checked ? 'done' : 'todo'}...`, 'Error');
      task.done = !checked;
    });
  }

  public update(task: Task): void {
    console.log(`Update task ${task.id}...`);
    this.taskToUpdate = task;
    this.displayAddOrUpdatePopup();
  }

  public addTask(): void {
    this.taskToUpdate = undefined;
    this.displayAddOrUpdatePopup();
  }

  public importTasks(): void {
    this.displayImportPopup();
  }

  public delete(task: Task): void {
    console.log(`delete task ${task.id}...`);
    this.todoListService.deleteTask(task.id).then(() => {
      this.reloadTasks();
      this.notifyService.success(`Task "${task.name}" deleted !`, 'Delete task successful');
    }).catch((error) => {
      console.error(error);
      this.notifyService.error(`Error pending delete task "${task.name}"...`, 'Error');
    });
  }

  public pageChanged(page: number): void {
    this.page = page;
    this.reloadTasks();
  }

  public reloadTasks(): void {
    const searchText: string = (this.search) ? this.search.text : '';
    const searchState: string = (this.search) ? this.search.state : 'ALL';
    this.todoListService.getTasks(this.sort, this.page, this.rowCount, searchText, searchState).then((page: Page<Task>) => {
      this.tasksPage = page;
    });
  }

  private displayAddOrUpdatePopup(): void {
    this.modalService.open(SaveOrUpdateTaskPopupComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        task: this.taskToUpdate
      }
    }).onClose.subscribe({
      next: (tasks) => {
        if (!!tasks?.length) {
          this.reloadTasks();
        }
      }
    });
  }

  private displayImportPopup(): void {
    this.modalService.open(ImportTasksPopupComponent, {
      modalClass: 'modal-dialog-centered'
    }).onClose.subscribe({
      next: (task) => {
        this.taskToUpdate = undefined;
        if (!!task) {
          this.reloadTasks();
        }
      }
    });
  }
}
