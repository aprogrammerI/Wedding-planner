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
  assignedTo?: string; // User name or email
  reminderDate?: string; // ISO date string for reminder
  reminderEnabled?: boolean; // Whether reminder is active
  subtasks?: Subtask[];
  vendorId?: number; // Assigned vendor
}

export interface Subtask {
  id: number;
  title: string;
  done: boolean;
  taskId: number; // Reference to parent task
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageKey = 'tasks';
  private tasks: Task[] = [];
  private nextId = 1;
  private nextSubtaskId = 1;

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
      { 
        id: 1, 
        title: 'Book venue', 
        done: true, 
        priority: 'high', 
        assignedTo: 'Jane Smith', 
        reminderDate: '2024-01-15', 
        reminderEnabled: true,
        subtasks: [
          { id: 1, title: 'Research venues', done: true, taskId: 1 },
          { id: 2, title: 'Schedule visits', done: true, taskId: 1 },
          { id: 3, title: 'Sign contract', done: true, taskId: 1 }
        ]
      },
      { 
        id: 2, 
        title: 'Choose photographer', 
        done: false, 
        priority: 'medium', 
        assignedTo: 'John Doe', 
        reminderDate: '2024-01-20', 
        reminderEnabled: true,
        subtasks: [
          { id: 4, title: 'Look at portfolios', done: false, taskId: 2 },
          { id: 5, title: 'Compare prices', done: false, taskId: 2 }
        ]
      },
      { id: 3, title: 'Order wedding rings', done: true, priority: 'medium', assignedTo: 'Jane Smith', reminderDate: '2024-01-10', reminderEnabled: false },
      { id: 4, title: 'Send invitations', done: false, priority: 'high', assignedTo: 'Event Planner', reminderDate: '2024-02-01', reminderEnabled: true },
      { id: 5, title: 'Plan honeymoon', done: false, priority: 'low', assignedTo: 'John Doe', reminderDate: '2024-03-01', reminderEnabled: false }
    ];
    this.nextId = 6;
    this.nextSubtaskId = 6;
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

  // Get tasks with active reminders
  getTasksWithReminders(): Observable<Task[]> {
    const now = new Date();
    const tasksWithReminders = this.tasks.filter(task => 
      task.reminderEnabled && 
      task.reminderDate && 
      !task.done
    );
    return of(tasksWithReminders).pipe(delay(100));
  }

  // Get overdue reminders
  getOverdueReminders(): Observable<Task[]> {
    const now = new Date();
    const overdueTasks = this.tasks.filter(task => 
      task.reminderEnabled && 
      task.reminderDate && 
      new Date(task.reminderDate) < now &&
      !task.done
    );
    return of(overdueTasks).pipe(delay(100));
  }

  // Get reminders due soon (within 3 days)
  getRemindersDueSoon(): Observable<Task[]> {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    const dueSoonTasks = this.tasks.filter(task => 
      task.reminderEnabled && 
      task.reminderDate && 
      new Date(task.reminderDate) <= threeDaysFromNow &&
      new Date(task.reminderDate) >= now &&
      !task.done
    );
    return of(dueSoonTasks).pipe(delay(100));
  }

  // Subtask methods
  addSubtask(taskId: number, title: string): Observable<Subtask> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (!task.subtasks) {
      task.subtasks = [];
    }

    const subtask: Subtask = {
      id: this.nextSubtaskId++,
      title,
      done: false,
      taskId
    };

    task.subtasks.push(subtask);
    this.persist();
    return of(subtask).pipe(delay(100));
  }

  updateSubtask(taskId: number, subtaskId: number, updates: Partial<Subtask>): Observable<Subtask> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) {
      throw new Error('Task or subtasks not found');
    }

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (!subtask) {
      throw new Error('Subtask not found');
    }

    Object.assign(subtask, updates);
    this.persist();
    return of(subtask).pipe(delay(100));
  }

  deleteSubtask(taskId: number, subtaskId: number): Observable<void> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) {
      throw new Error('Task or subtasks not found');
    }

    const index = task.subtasks.findIndex(st => st.id === subtaskId);
    if (index === -1) {
      throw new Error('Subtask not found');
    }

    task.subtasks.splice(index, 1);
    this.persist();
    return of(void 0).pipe(delay(100));
  }

  toggleSubtask(taskId: number, subtaskId: number): Observable<Subtask> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) {
      throw new Error('Task or subtasks not found');
    }

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (!subtask) {
      throw new Error('Subtask not found');
    }

    subtask.done = !subtask.done;
    this.persist();
    return of(subtask).pipe(delay(100));
  }
}
