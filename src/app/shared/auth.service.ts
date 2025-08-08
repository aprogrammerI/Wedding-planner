import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock users for demonstration
  private mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password123' }
  ];

  constructor() {
    // Check if user is already logged in
    this.checkAuthStatus();
  }

  login(creds: { email: string; password: string }): Observable<AuthResponse> {
    const user = this.mockUsers.find(u => u.email === creds.email && u.password === creds.password);
    
    if (user) {
      const response: AuthResponse = {
        token: `mock-token-${user.id}`,
        user: { id: user.id, name: user.name, email: user.email }
      };
      
      return of(response).pipe(
        delay(500), // Simulate network delay
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
    } else {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Invalid email or password'));
        }, 500);
      });
    }
  }

  register(user: { name: string; email: string; password: string }): Observable<AuthResponse> {
    // Check if email already exists
    const existingUser = this.mockUsers.find(u => u.email === user.email);
    
    if (existingUser) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Email already exists'));
        }, 500);
      });
    }

    const newUser = {
      id: this.mockUsers.length + 1,
      name: user.name,
      email: user.email,
      password: user.password
    };
    
    this.mockUsers.push(newUser);
    
    const response: AuthResponse = {
      token: `mock-token-${newUser.id}`,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    };
    
    return of(response).pipe(
      delay(500), // Simulate network delay
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Extract user ID from mock token
      const userId = parseInt(token.replace('mock-token-', ''));
      const user = this.mockUsers.find(u => u.id === userId);
      if (user) {
        this.currentUserSubject.next({ id: user.id, name: user.name, email: user.email });
      } else {
        this.logout();
      }
    }
  }
}
