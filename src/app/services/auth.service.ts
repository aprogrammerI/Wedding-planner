import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RoleOption {
  role: string;
  displayName: string;
  icon: string;
  description: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Available roles
  public readonly availableRoles: RoleOption[] = [
    {
      role: 'bride',
      displayName: 'Bride',
      icon: 'assets/bride.png',
      description: 'The bride-to-be'
    },
    {
      role: 'groom',
      displayName: 'Groom',
      icon: 'assets/groom.png',
      description: 'The groom-to-be'
    },
    {
      role: 'event-planner',
      displayName: 'Event Planner',
      icon: 'assets/wedding-planner-color.png',
      description: 'Professional wedding planner'
    },
    {
      role: 'user',
      displayName: 'Other',
      icon: 'assets/user.png',
      description: 'Guest or other participant'
    }
  ];

  // Mock users for demonstration
  private mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'groom' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'bride' }
  ];

  constructor() {
    // Check if user is already logged in
    this.checkAuthStatus();
  }

  login(creds: { email: string; password: string }): Observable<AuthResponse> {
    // Special admin login - bypasses role selection
    if (creds.email === 'admin@admin.com' && creds.password === 'admin') {
      const adminUser = {
        id: 999,
        name: 'Administrator',
        email: 'admin@admin.com',
        role: 'admin'
      };
      
      const response: AuthResponse = {
        token: `admin-token-${adminUser.id}`,
        user: adminUser
      };
      
      return of(response).pipe(
        delay(500), // Simulate network delay
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_role', response.user.role || '');
          this.currentUserSubject.next(response.user);
        })
      );
    }
    
    // Regular user login
    const user = this.mockUsers.find(u => u.email === creds.email && u.password === creds.password);
    
    if (user) {
      const response: AuthResponse = {
        token: `mock-token-${user.id}`,
        user: { id: user.id, name: user.name, email: user.email, role: user.role || '' }
      };
      
      return of(response).pipe(
        delay(500), // Simulate network delay
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_role', response.user.role || '');
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

  loginWithGoogle(): Observable<AuthResponse> {
    // Simulate Google OAuth flow
    return new Observable(observer => {
      setTimeout(() => {
        // Mock Google user data
        const googleUser = {
          id: Date.now(),
          name: 'Google User',
          email: 'googleuser@gmail.com',
          role: '' // Role will be set later
        };
        
        const response: AuthResponse = {
          token: `google-token-${googleUser.id}`,
          user: googleUser
        };
        
        // Store token and user
        localStorage.setItem('auth_token', response.token);
        this.currentUserSubject.next(response.user);
        
        observer.next(response);
        observer.complete();
      }, 1000); // Simulate OAuth delay
    });
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    // Check if email exists
    const userExists = this.mockUsers.some(u => u.email === email);
    
    return new Observable(observer => {
      setTimeout(() => {
        if (userExists) {
          observer.next({
            success: true,
            message: 'Password reset instructions have been sent to your email.'
          });
        } else {
          observer.next({
            success: false,
            message: 'No account found with this email address.'
          });
        }
        observer.complete();
      }, 800); // Simulate email sending delay
    });
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
      password: user.password,
      role: '' // Role will be set later
    };
    
    this.mockUsers.push(newUser);
    
    const response: AuthResponse = {
      token: `mock-token-${newUser.id}`,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: '' }
    };
    
    return of(response).pipe(
      delay(500), // Simulate network delay
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  selectRole(role: string): Observable<boolean> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      // Update user role in mock data
      const userIndex = this.mockUsers.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        this.mockUsers[userIndex].role = role;
      }
      
      // Update current user
      const updatedUser = { ...currentUser, role };
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem('user_role', role);
      
      return of(true).pipe(delay(300));
    }
    return of(false);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  hasRole(): boolean {
    const user = this.getCurrentUser();
    return user ? !!user.role : false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role || null : null;
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Check if it's an admin token
      if (token.startsWith('admin-token-')) {
        const adminUser = {
          id: 999,
          name: 'Administrator',
          email: 'admin@admin.com',
          role: 'admin'
        };
        this.currentUserSubject.next(adminUser);
        return;
      }
      
      // Extract user ID from mock token
      const userId = parseInt(token.replace('mock-token-', ''));
      const user = this.mockUsers.find(u => u.id === userId);
      if (user) {
        const role = localStorage.getItem('user_role') || user.role || '';
        this.currentUserSubject.next({ 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role 
        });
      } else {
        this.logout();
      }
    }
  }
}
