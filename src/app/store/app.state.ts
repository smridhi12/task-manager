import { EntityState } from '@ngrx/entity';
import { Task } from '../models/task.model';

export interface TaskState extends EntityState<Task> {
}

export interface AppState {
  tasks: TaskState;
}
