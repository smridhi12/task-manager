import { createReducer, on } from '@ngrx/store';
import { addTask, updateTask, deleteTask, loadTasks, loadTasksSuccess, loadTasksFailure } from '../actions/task.actions';
import { Task } from '../../models/task.model';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface TaskState extends EntityState<Task> {
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<Task> = createEntityAdapter<Task>();

export const initialState: TaskState = adapter.getInitialState({
  loading: false,
  error: null
});

export const taskReducer = createReducer(
  initialState,
  on(loadTasks, (state) => ({ ...state, loading: true, error: null })),
  on(loadTasksSuccess, (state, { tasks }) => adapter.setAll(tasks, { ...state, loading: false })),
  on(loadTasksFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(addTask, (state, { task }) => adapter.addOne(task, state)),
  on(updateTask, (state, { task }) => adapter.updateOne({ id: task.id, changes: task }, state)),
  on(deleteTask, (state, { id }) => adapter.removeOne(id, state))
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
