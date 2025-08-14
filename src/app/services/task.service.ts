import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Task {
  id: number;
  title: string;
  done: boolean;
  description?: string;
  dueDate?: string; // ISO date string
  priority?: 'low' | 'medium' | 'high';
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageKey = 'tasks';
  private tasks: Task[] = [];
  private nextId = 1;

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Task[];
        this.tasks = parsed;
        this.nextId = (this.tasks.reduce((max, t) => Math.max(max, t.id), 0) || 0) + 1;
      } catch {
        this.seedDefaults();
      }
    } else {
      this.seedDefaults();
    }
  }

  private seedDefaults() {
    this.tasks = [
      { id: 1, title: 'Book venue', done: true, priority: 'high' },
      { id: 2, title: 'Choose photographer', done: false, priority: 'medium' },
      { id: 3, title: 'Order wedding rings', done: true, priority: 'medium' },
      { id: 4, title: 'Send invitations', done: false, priority: 'high' },
      { id: 5, title: 'Plan honeymoon', done: false, priority: 'low' }
    ];
    this.nextId = 6;
    this.persist();
  }

  private persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  list(): Observable<Task[]> {
    return of(this.tasks).pipe(delay(100));
  }

  add(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: this.nextId++
    };
    this.tasks.push(newTask);
    this.persist();
    return of(newTask).pipe(delay(100));
  }

  update(task: Task): Observable<Task> {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
    }
    this.persist();
    return of(task).pipe(delay(100));
  }

  remove(id: number): Observable<void> {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.persist();
    return of(void 0).pipe(delay(100));
  }
}
