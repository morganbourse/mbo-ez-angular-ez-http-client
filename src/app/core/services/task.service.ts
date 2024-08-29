import {
  EzHttpClient,
  EzHttpClientCommonResponseOperators,
  EzHttpClientHeaders,
  EzHttpPartFile,
  EzHttpQueryParam,
  EzHttpRequestBody,
  EzHttpRequestDELETE,
  EzHttpRequestGET,
  EzHttpRequestParam,
  EzHttpRequestPOST,
  EzHttpRequestPUT,
  EzHttpResponse
} from "ez-http-client-lib";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {CoreModule} from "../core.module";
import {Page} from "../models/page.model";
import {PartialTask} from "../models/tasks/partial-task.model";
import {Task} from "../models/tasks/task.model";

@EzHttpClientHeaders({
    'Content-Type': 'application/json'
})
@EzHttpClientCommonResponseOperators({
    operators: [
        catchError((error) => {
            return throwError(error.error.errorCode);
        })
    ],
    before: true
})
@EzHttpClient('/api/tasks', CoreModule)
export class TaskService {
    @EzHttpRequestGET()
    public getTasks(
        @EzHttpQueryParam('sort') sort: Array<string>,
        @EzHttpQueryParam('page') page: number,
        @EzHttpQueryParam('size') rowCount: number,
        @EzHttpQueryParam('text') searchText?: string,
        @EzHttpQueryParam('state') searchState?: string,
        @EzHttpResponse response?: Observable<Page<Task>>
    ): Promise<Page<Task>> {
        return response!.toPromise();
    }

    @EzHttpRequestPUT({
        path: '/{taskId}'
    })
    public updateTask(@EzHttpRequestParam('taskId') id: number, @EzHttpRequestBody partialTask: PartialTask, @EzHttpResponse response?: Observable<Task>): Promise<Task> {
        return response!.toPromise();
    }

    @EzHttpRequestPUT({
        path: '/{taskId}/state'
    })
    public updateTaskState(@EzHttpRequestParam('taskId') id: number, @EzHttpRequestBody state: {done: boolean}, @EzHttpResponse response?: Observable<Task>): Promise<Task> {
        return response!.toPromise();
    }

    @EzHttpRequestDELETE({
        path: '/{taskId}'
    })
    public deleteTask(@EzHttpRequestParam('taskId') id: number, @EzHttpResponse response?: Observable<Task>): Promise<Task> {
        return response!.toPromise();
    }

    @EzHttpRequestPOST()
    public addTask(@EzHttpRequestBody partialTask: PartialTask, @EzHttpResponse response?: Observable<Task>): Promise<Task> {
        return response!.toPromise();
    }

    @EzHttpRequestPOST({
        path: '/import'
    })
    public importTasks(@EzHttpPartFile('file') file: File, @EzHttpResponse response?: Observable<Array<Task>>): Promise<Array<Task>> {
        return response!.toPromise();
    }
}
