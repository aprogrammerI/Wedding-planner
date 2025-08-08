import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Task {
  id: number;
  title: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    { id: 1, title: 'Book venue', done: true },
    { id: 2, title: 'Choose photographer', done: false },
    { id: 3, title: 'Order wedding rings', done: true },
    { id: 4, title: 'Send invitations', done: false },
    { id: 5, title: 'Plan honeymoon', done: false }
  ];

  private nextId = 6;

  list(): Observable<Task[]> {
    return of(this.tasks).pipe(delay(100));
  }

  add(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: this.nextId++
    };
    this.tasks.push(newTask);
    return of(newTask).pipe(delay(100));
  }

  update(task: Task): Observable<Task> {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
    }
    return of(task).pipe(delay(100));
  }

  remove(id: number): Observable<void> {
    this.tasks = this.tasks.filter(t => t.id !== id);
    return of(void 0).pipe(delay(100));
  }
}
