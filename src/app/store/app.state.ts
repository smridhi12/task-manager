import { EntityState } from '@ngrx/entity';
import { Task } from '../models/task.model';

export interface TaskState extends EntityState<Task> {
  // Additional properties can be added here if needed
}

export interface AppState {
  tasks: TaskState;
}
