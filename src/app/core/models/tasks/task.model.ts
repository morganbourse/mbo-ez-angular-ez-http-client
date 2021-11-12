import { PartialTask } from "./partial-task.model";

export interface Task extends PartialTask {
    id: number;
    done: boolean;
}
