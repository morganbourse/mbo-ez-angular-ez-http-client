import { TaskStateFilter } from "../enum/task-state-filter.enum";

export interface Search {
    text: string;
    state: TaskStateFilter;
}
