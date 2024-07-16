  import { Injectable } from '@angular/core';
  import {Actions} from '@ngrx/effects';
  import { createEffect, ofType } from '@ngrx/effects';
  import { Store } from '@ngrx/store';
  import { of } from 'rxjs';
  import { map, mergeMap, catchError } from 'rxjs/operators';
  import { addTask, updateTask, deleteTask, loadTasks, loadTasksSuccess, loadTasksFailure } from '../actions/task.actions';
  import { TaskService } from '../../services/task.service';
  import { Task } from '../../models/task.model';

  @Injectable()
  export class TaskEffects {
    constructor( private actions$: Actions, private taskService: TaskService, private store: Store) {
 
        var loadTasks$ = createEffect(() =>
          this.actions$.pipe(
            ofType(loadTasks),
            mergeMap(() => {
              try {
                console.log("hello");
                const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
                return of(loadTasksSuccess({ tasks }));
              } catch (error) {
                return of(loadTasksFailure({ error }));
              }
            })
          )
        );
    

    var addTask$ = createEffect(() =>
      this.actions$.pipe(
        ofType(addTask),
        mergeMap(action => {
          return of(action).pipe(
            map(({ task }) => {
              const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
              tasks.push(task);
              localStorage.setItem('tasks', JSON.stringify(tasks));
              return addTask({ task });
            }),
            catchError(error => of(loadTasksFailure({ error })))
          );
        })
      )
    );

   var updateTask$ = createEffect(() =>
      this.actions$.pipe(
        ofType(updateTask),
        mergeMap(action => {
          return of(action).pipe(
            map(({ task }) => {
              const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
              const index = tasks.findIndex(t => t.id === task.id);
              if (index !== -1) {
                tasks[index] = task;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                return updateTask({ task });
              } else {
                throw new Error('Task not found');
              }
            }),
            catchError(error => of(loadTasksFailure({ error })))
          );
        })
      )
    );

   var deleteTask$ = createEffect(() =>
      this.actions$.pipe(
        ofType(deleteTask),
        mergeMap(action => {
          return of(action).pipe(
            map(({ id }) => {
              const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
              const updatedTasks = tasks.filter(task => task.id !== id);
              localStorage.setItem('tasks', JSON.stringify(updatedTasks));
              return deleteTask({ id });
            }),
            catchError(error => of(loadTasksFailure({ error })))
          );
        })
      )
    );
  }
}

