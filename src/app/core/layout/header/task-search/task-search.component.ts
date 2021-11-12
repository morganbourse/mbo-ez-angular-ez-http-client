import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { TaskStateFilter } from './enum/task-state-filter.enum';
import { TaskSearchNotifyService } from './services/task-search-notifier.service';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements AfterViewInit, OnDestroy {
  @ViewChild('searchInput')
  private input!: ElementRef<HTMLInputElement>;

  private searchKeyUpSubscription: Subscription | undefined;

  taskStateFilterEnum = TaskStateFilter;
  searchValue = '';
  taskStateFilter: TaskStateFilter = TaskStateFilter.ALL;

  public constructor(private taskSearchNotifyService: TaskSearchNotifyService) {
  }

  /**
   * After init view event listener
   */
  public ngAfterViewInit(): void {
    this.searchKeyUpSubscription = fromEvent(this.input.nativeElement,'keyup')
    .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(300),
        distinctUntilChanged(),
        tap((text) => {
          this.searchValue = text;
          this.notifySearch();
        })
    ).subscribe();
  }

  /**
   * On destroy component listener
   */
  public ngOnDestroy(): void {
    if (this.searchKeyUpSubscription && !this.searchKeyUpSubscription.closed) {
      this.searchKeyUpSubscription.unsubscribe();
    }
  }

  /**
   * On task state filter change event listener
   *
   * @param $event The event to listen
   */
  public onStateFilterChanged($event: Event): void {
    this.taskStateFilter = ($event.target! as HTMLSelectElement).value as TaskStateFilter;
    this.notifySearch();
  }
  
  /**
   * Notify search with search text and state filter
   */
  private notifySearch(): void {
    this.taskSearchNotifyService.notify({text: this.searchValue, state: this.taskStateFilter});
  }
}
