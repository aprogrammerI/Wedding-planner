import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError, switchMap } from 'rxjs/operators';

// Frontend interfaces (for component usage)
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

// Backend DTO interfaces
export interface TaskDTO {
  id: number;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignee: 'BRIDE' | 'GROOM' | 'PLANNER' | 'OTHER';
  completed: boolean;
  reminderEnabled: boolean;
  subtasks?: SubtaskDTO[];
}

export interface SubtaskDTO {
  id: number;
  title: string;
  completed: boolean;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignee: 'BRIDE' | 'GROOM' | 'PLANNER' | 'OTHER';
  completed?: boolean;
  reminderEnabled?: boolean;
}

export interface ProgressDTO {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
}

// export interface OverdueReminderDTO {
//   taskId: number;
//   title: string;
//   dueDate: string;
//   daysOverdue: number;
// }

export interface OverdueReminder {
  taskId: number;
  title: string;
  assignee: 'BRIDE' | 'GROOM' | 'PLANNER' | 'OTHER' | string;
  daysOverdue: number;
  dueDate: string; // ISO
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_BASE_URL = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  // Mapping methods between frontend and backend
  private mapTaskDTOToTask(dto: TaskDTO): Task {
    return {
      id: dto.id,
      title: dto.title,
      done: dto.completed,
      description: dto.description,
      dueDate: dto.dueDate,
      priority: dto.priority.toLowerCase() as 'low' | 'medium' | 'high',
      assignedTo: this.mapAssigneeToString(dto.assignee),
      reminderDate: dto.dueDate, // Use due date as reminder date
      reminderEnabled: dto.reminderEnabled,
      subtasks: dto.subtasks?.map(st => this.mapSubtaskDTOToSubtask(st, dto.id))
    };
  }

  private mapTaskToTaskDTO(task: Task): TaskDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority?.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH' || 'MEDIUM',
      assignee: this.mapStringToAssignee(task.assignedTo || 'OTHER'),
      completed: task.done,
      reminderEnabled: task.reminderEnabled || false,
      subtasks: task.subtasks?.map(st => this.mapSubtaskToSubtaskDTO(st))
    };
  }

  private mapSubtaskDTOToSubtask(dto: SubtaskDTO, taskId: number): Subtask {
    return {
      id: dto.id,
      title: dto.title,
      done: dto.completed,
      taskId: taskId
    };
  }

  private mapSubtaskToSubtaskDTO(subtask: Subtask): SubtaskDTO {
    return {
      id: subtask.id,
      title: subtask.title,
      completed: subtask.done
    };
  }

  private mapAssigneeToString(assignee: 'BRIDE' | 'GROOM' | 'PLANNER' | 'OTHER'): string {
    switch (assignee) {
      case 'BRIDE': return 'Bride';
      case 'GROOM': return 'Groom';
      case 'PLANNER': return 'Wedding Planner';
      case 'OTHER': return 'Other';
      default: return 'Other';
    }
  }

  private mapStringToAssignee(assignee: string): 'BRIDE' | 'GROOM' | 'PLANNER' | 'OTHER' {
    switch (assignee.toLowerCase()) {
      case 'bride': return 'BRIDE';
      case 'groom': return 'GROOM';
      case 'wedding planner': return 'PLANNER';
      case 'other': return 'OTHER';
      default: return 'OTHER';
    }
  }


  list(): Observable<Task[]> {
    return this.http.get<TaskDTO[]>(this.API_BASE_URL).pipe(
      map(dtos => dtos.map(dto => this.mapTaskDTOToTask(dto))),
      catchError(error => {
        console.error('Error fetching tasks:', error);
        return throwError(() => new Error('Failed to fetch tasks'));
      })
    );
  }

  add(task: Omit<Task, 'id'>): Observable<Task> {
    const createRequest: TaskCreateRequest = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: (task.priority?.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH') || 'MEDIUM',
      assignee: this.mapStringToAssignee(task.assignedTo || 'OTHER'),
      completed: task.done,
      reminderEnabled: task.reminderEnabled || false
    };

    return this.http.post<TaskDTO>(this.API_BASE_URL, createRequest).pipe(
      map(dto => this.mapTaskDTOToTask(dto)),
      catchError(error => {
        console.error('Error creating task:', error);
        return throwError(() => new Error('Failed to create task'));
      })
    );
  }

  update(task: Task): Observable<Task> {
    const taskDTO = this.mapTaskToTaskDTO(task);
    return this.http.put<TaskDTO>(`${this.API_BASE_URL}/${task.id}`, taskDTO).pipe(
      map(dto => this.mapTaskDTOToTask(dto)),
      catchError(error => {
        console.error('Error updating task:', error);
        return throwError(() => new Error('Failed to update task'));
      })
    );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting task:', error);
        return throwError(() => new Error('Failed to delete task'));
      })
    );
  }

  // Get tasks with active reminders
  getTasksWithReminders(): Observable<Task[]> {
    return this.list().pipe(
      map(tasks => {
        const now = new Date();
        return tasks.filter(task =>
          task.reminderEnabled &&
          task.reminderDate &&
          !task.done
        );
      })
    );
  }

  // Get overdue reminders
  // getOverdueReminders(): Observable<Task[]> {
  //   return this.http.get<OverdueReminderDTO[]>(`${this.API_BASE_URL}/overdue`).pipe(
  //     map(overdueReminders => {
  //       // Convert overdue reminders to tasks for compatibility
  //       return overdueReminders.map(reminder => ({
  //         id: reminder.taskId,
  //         title: reminder.title,
  //         done: false,
  //         dueDate: reminder.dueDate,
  //         reminderEnabled: true,
  //         reminderDate: reminder.dueDate
  //       } as Task));
  //     }),
  //     catchError(error => {
  //       console.error('Error fetching overdue reminders:', error);
  //       return of([]);
  //     })
  //   );
  // }


  getOverdueReminders() {
    return this.http.get<OverdueReminder[]>('http://localhost:8080/api/tasks/overdue');
  }

  // Get reminders due soon (within 3 days)
  getRemindersDueSoon(): Observable<Task[]> {
    return this.list().pipe(
      map(tasks => {
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
        return tasks.filter(task =>
          task.reminderEnabled &&
          task.reminderDate &&
          new Date(task.reminderDate) <= threeDaysFromNow &&
          new Date(task.reminderDate) >= now &&
          !task.done
        );
      })
    );
  }

  // Subtask methods
  addSubtask(taskId: number, title: string): Observable<Subtask> {
    const subtaskRequest = {
      title: title,
      completed: false
    };

    return this.http.post<SubtaskDTO>(`${this.API_BASE_URL}/${taskId}/subtasks`, subtaskRequest).pipe(
      map(dto => this.mapSubtaskDTOToSubtask(dto, taskId)),
      catchError(error => {
        console.error('Error adding subtask:', error);
        return throwError(() => new Error('Failed to add subtask'));
      })
    );
  }

  updateSubtask(taskId: number, subtaskId: number, updates: Partial<Subtask>): Observable<Subtask> {
    const subtaskRequest = {
      title: updates.title || '',
      completed: updates.done || false
    };

    return this.http.put<SubtaskDTO>(`${this.API_BASE_URL}/${taskId}/subtasks/${subtaskId}`, subtaskRequest).pipe(
      map(dto => this.mapSubtaskDTOToSubtask(dto, taskId)),
      catchError(error => {
        console.error('Error updating subtask:', error);
        return throwError(() => new Error('Failed to update subtask'));
      })
    );
  }

  deleteSubtask(taskId: number, subtaskId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/${taskId}/subtasks/${subtaskId}`).pipe(
      catchError(error => {
        console.error('Error deleting subtask:', error);
        return throwError(() => new Error('Failed to delete subtask'));
      })
    );
  }

  toggleSubtask(taskId: number, subtaskId: number): Observable<Subtask> {
    // First get the current subtask to toggle its status
    return this.list().pipe(
      map(tasks => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !task.subtasks) {
          throw new Error('Task or subtasks not found');
        }
        const subtask = task.subtasks.find(st => st.id === subtaskId);
        if (!subtask) {
          throw new Error('Subtask not found');
        }
        return subtask;
      }),
      switchMap(subtask => {
        const updates = { done: !subtask.done };
        return this.updateSubtask(taskId, subtaskId, updates);
      }),
      catchError(error => {
        console.error('Error toggling subtask:', error);
        return throwError(() => new Error('Failed to toggle subtask'));
      })
    );
  }
}
