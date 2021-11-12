import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Subscription } from 'rxjs';
import { PartialTask } from 'src/app/core/models/tasks/partial-task.model';
import { Task } from 'src/app/core/models/tasks/task.model';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-save-or-update-task-popup',
  templateUrl: './save-or-update-task-popup.component.html',
  styleUrls: ['./save-or-update-task-popup.component.scss']
})
export class SaveOrUpdateTaskPopupComponent implements OnChanges, OnDestroy {
  @ViewChild(ModalDirective) 
  private modal: ModalDirective | undefined;

  private onHiddenSubscription?: Subscription;

  @Input()
  display!: boolean;

  @Output()
  displayChange: EventEmitter<boolean>;

  @Output()
  onClose: EventEmitter<any>;

  @Input()
  task?: Task;

  @Output()
  onSuccess: EventEmitter<Task>;

  taskModel!: PartialTask;

  constructor(private taskService: TaskService) {
    this.displayChange = new EventEmitter();
    this.onClose = new EventEmitter();
    this.onSuccess = new EventEmitter();

    this.onHiddenSubscription = this.modal?.onHidden.subscribe(() => {
      this.onClose.emit();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.display.currentValue === true) {
      this.modal?.show();
    } else {
      this.modal?.hide();
    }

    if (changes.task && changes.task.currentValue) {
      this.taskModel = {name: changes.task.currentValue.name, description: changes.task.currentValue.description};
    } else {
      this.taskModel = {name: '', description: ''};
    }
  }

  ngOnDestroy(): void {
    if (this.onHiddenSubscription && !this.onHiddenSubscription.closed) {
      this.onHiddenSubscription.unsubscribe();
    }
  }

  /**
   * Close the current modal instance
   */
  close(): void {
    this.display = false;
    this.displayChange.emit(false);
  }

  /**
   * Create or update a task
   */
  createOrUpdate(): void {
    let promise: Promise<Task>;
    if (this.task) {
      promise = this.taskService.updateTask(this.task.id, this.taskModel!);
    } else {
      promise = this.taskService.addTask(this.taskModel!);
    }

    promise.then((updatedTask: Task) => {
      this.onSuccess.emit(updatedTask);
      this.close();
    });
  }
}
