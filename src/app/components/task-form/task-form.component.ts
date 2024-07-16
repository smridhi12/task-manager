import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addTask, loadTasks, updateTask } from '../../store/actions/task.actions';
import { Task } from '../../models/task.model';
import { v4 as uuidv4 } from 'uuid';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  editingTask: Task | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required]  
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras?.state) {
          this.editingTask = navigation.extras.state['task'] as Task;
          if (this.editingTask) {
            this.taskForm.patchValue(this.editingTask);
          }
        }
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(loadTasks());
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        ...this.taskForm.value,
        id: this.editingTask ? this.editingTask.id : uuidv4(),
        history: this.editingTask
          ? [...this.editingTask.history, { action: 'Updated', timestamp: new Date() }]
          : [{ action: 'Created', timestamp: new Date() }]
      };

      if (this.editingTask) {
        this.store.dispatch(updateTask({ task: newTask }));
        this.toastr.success('Task updated successfully!', 'Update Success');
      } else {
        this.store.dispatch(addTask({ task: newTask }));
        this.toastr.success('Task added successfully!', 'Add Success');
      }

      this.router.navigate(['/tasks']);
    } else {
      this.toastr.error('Please fill in all required fields.', 'Form Incomplete'); 
    }
  }

  onCancel()
  {
    this.router.navigate(['/tasks']);
  }
}
