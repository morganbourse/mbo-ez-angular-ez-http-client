import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/core/models/tasks/task.model';
import { TaskService } from 'src/app/core/services/task.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'import-tasks-popup',
  templateUrl: './import-tasks-popup.component.html',
  styleUrls: ['./import-tasks-popup.component.scss']
})
export class ImportTasksPopupComponent implements OnChanges, OnDestroy {
  @ViewChild(ModalDirective) 
  private modal: ModalDirective | undefined;

  private onHiddenSubscription?: Subscription;

  @Input()
  display!: boolean;

  @Output()
  displayChange: EventEmitter<boolean>;

  @Output()
  onClose: EventEmitter<any>;

  @Output()
  onSuccess: EventEmitter<Array<Task>>;

  file!: File;

  displayFileRequired = false;

  constructor(private taskService: TaskService, private notifyService: ToastService) {
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
  }

  ngOnDestroy(): void {
    if (this.onHiddenSubscription && !this.onHiddenSubscription.closed) {
      this.onHiddenSubscription.unsubscribe();
    }
  }

  onFileSelected(event: any): void {
    this.file = event.target.files ? event.target.files[0] : undefined;
    this.displayFileRequired = !this.file;
  }

  /**
   * Close the current modal instance
   */
  close(): void {
    this.display = false;
    this.displayChange.emit(false);
  }

  /**
   * Import tasks
   */
  import(): void {
    this.displayFileRequired = !this.file;
    if (this.displayFileRequired) {
      return;
    }

    this.taskService.importTasks(this.file).then((tasks) => {
      this.onSuccess.emit(tasks);
      this.close();
      this.notifyService.success(`${tasks.length} tasks imported successfully !`);
    }).catch((e) => {
      this.notifyService.error('An error has occured pending tasks import...');
      console.error(e);
    });
  }
}
