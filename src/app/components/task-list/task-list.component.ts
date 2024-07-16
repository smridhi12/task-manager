import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { selectAllTasks } from '../../store/selectors/task.selectors';
import { deleteTask } from '../../store/actions/task.actions';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  filteredTasks: Task[] = [];
  filters = {
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    status: ''
  };

  expandedTaskId: number | null = null;
  sortField: keyof Task = 'title';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private store: Store, private router: Router, private toastr: ToastrService) {
    this.tasks$ = this.store.select(selectAllTasks);
  }

  ngOnInit(): void {
    this.tasks$.subscribe(tasks => {
      this.filteredTasks = this.filterTasks(tasks);
      this.sortTasks();
    });
  }

  editTask(task: Task) {
    this.router.navigate(['/add-task'], { state: { task } });
  }
  toggleHistory(taskId: number): void {
    if (this.expandedTaskId === taskId) {
      this.expandedTaskId = null; 
    } else {
      this.expandedTaskId = taskId; 
    }
  }

  deleteTask(taskId: number) {
    this.store.dispatch(deleteTask({ id: taskId }));
  }

  filterTasks(tasks: Task[]): Task[] {
    return tasks.filter(task => 
      (!this.filters.title || task.title.toLowerCase().includes(this.filters.title.toLowerCase())) &&
      (!this.filters.description || task.description.toLowerCase().includes(this.filters.description.toLowerCase())) &&
      (!this.filters.dueDate || task.dueDate.includes(this.filters.dueDate)) &&
      (!this.filters.priority || task.priority.toLowerCase().includes(this.filters.priority.toLowerCase())) &&
      (!this.filters.status || task.status.toLowerCase().includes(this.filters.status.toLowerCase()))
    );
  }

  sortTasks(): void {
    this.filteredTasks = this.filteredTasks.sort((a, b) => {
      const fieldA = a[this.sortField];
      const fieldB = b[this.sortField];

      if (this.sortOrder === 'asc') {
        return fieldA < fieldB ? -1 : (fieldA > fieldB ? 1 : 0);
      } else {
        return fieldA > fieldB ? -1 : (fieldA < fieldB ? 1 : 0);
      }
    });
  }
  

  sort(field: keyof Task): void { 
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.sortTasks();
  }

  exportToCSV() {
    const headers = ['Title', 'Description', 'Due Date', 'Priority', 'Status'];
    const rows = this.filteredTasks.map(task => [
      task.title,
      task.description,
      this.formatDate(task.dueDate),
      task.priority,
      task.status
    ]);
    
    if(rows.length <=0)
      {
        this.toastr.error('There is no row to export.');
        return;
      }
  
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
formatDate(dateString: string): string {
  if (!dateString) return ''; 

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ''; 
  return date.toISOString().split('T')[0];
}
}
