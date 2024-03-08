import {
  Component
} from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Task } from 'src/app/core/models/tasks/task.model';
import { TaskService } from 'src/app/core/services/task.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'import-tasks-popup',
  templateUrl: './import-tasks-popup.component.html',
  styleUrls: ['./import-tasks-popup.component.scss'],
})
export class ImportTasksPopupComponent {
  file!: File;

  displayFileRequired = false;

  constructor(
    private taskService: TaskService,
    private notifyService: ToastService,
    private modalRef: MdbModalRef<ImportTasksPopupComponent>
  ) { }

  onFileSelected(event: any): void {
    this.file = event.target.files ? event.target.files[0] : undefined;
    this.displayFileRequired = !this.file;
  }

  /**
   * Close the current modal instance
   */
  close(tasks?: Array<Task>): void {
    this.modalRef?.close(tasks);
  }

  /**
   * Import tasks
   */
  import(): void {
    this.displayFileRequired = !this.file;
    if (this.displayFileRequired) {
      return;
    }

    this.taskService
      .importTasks(this.file)
      .then((tasks) => {
        this.notifyService.success(
          `${tasks.length} tasks imported successfully !`
        );
        this.close(tasks);
      })
      .catch((e) => {
        this.notifyService.error(
          'An error has occurred pending tasks import...'
        );
        console.error(e);
      });
  }
}
