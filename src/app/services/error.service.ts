import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ErrorMessage {
  message: string;
  type: 'error' | 'warning' | 'success';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<ErrorMessage | null>(null);
  public error$ = this.errorSubject.asObservable();

  showError(message: string, duration: number = 5000): void {
    this.errorSubject.next({ message, type: 'error', duration });
  }

  showWarning(message: string, duration: number = 5000): void {
    this.errorSubject.next({ message, type: 'warning', duration });
  }

  showSuccess(message: string, duration: number = 3000): void {
    this.errorSubject.next({ message, type: 'success', duration });
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}
