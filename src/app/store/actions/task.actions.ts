import { createAction, props  } from '@ngrx/store';
import { Task } from '../../models/task.model';


// Action to load tasks
export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction('[Task] Load Tasks Success', props<{ tasks: Task[] }>());
export const loadTasksFailure = createAction('[Task] Load Tasks Failure', props<{ error: any }>());

// Action to add a task
export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());

// Action to update a task
export const updateTask = createAction('[Task] Update Task', props<{ task: Task }>());

// Action to delete a task
export const deleteTask = createAction('[Task] Delete Task', props<{ id: number }>());
