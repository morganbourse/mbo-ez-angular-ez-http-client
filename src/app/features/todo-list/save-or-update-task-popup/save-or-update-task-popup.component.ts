import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { PartialTask } from 'src/app/core/models/tasks/partial-task.model';
import { Task } from 'src/app/core/models/tasks/task.model';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'save-or-update-task-popup',
  templateUrl: './save-or-update-task-popup.component.html',
  styleUrls: ['./save-or-update-task-popup.component.scss']
})
export class SaveOrUpdateTaskPopupComponent {
  _task!: Task;
  taskModel!: PartialTask;
  text!: string;

  set task(task: Task) {
    this._task = task;
    this.taskModel = { ...task };
    this.text = !!task?.id ? 'UPDATE' : 'ADD';
  }

  constructor(
    private taskService: TaskService,
    private modalRef: MdbModalRef<SaveOrUpdateTaskPopupComponent>
  ) {
    console.log('Open !');
  }

  /**
   * Close the current modal instance
   * 
   * @param task The updated task
   */
  close(task?: Task): void {
    this.modalRef?.close(task);
  }

  /**
   * Create or update a task
   */
  createOrUpdate(): void {
    let promise: Promise<Task>;
    if (!!this._task?.id) {
      promise = this.taskService.updateTask(this._task.id, this.taskModel!);
    } else {
      promise = this.taskService.addTask({ ...this.taskModel });
    }

    promise.then((updatedTask: Task) => {
      this.close(updatedTask);
    });
  }
}
