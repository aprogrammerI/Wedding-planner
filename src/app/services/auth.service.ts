import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, tap, catchError, map } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
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
  private readonly API_BASE_URL = 'http://localhost:8080/api';

  // Available roles - all map to USER in backend
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
      role: 'guest',
      displayName: 'Guest',
      icon: 'assets/user.png',
      description: 'Wedding guest or other participant'
    }
  ];


  constructor(private http: HttpClient, private router: Router) {
    // Check if user is already logged in
    this.checkAuthStatus();
  }


  login(creds: { email: string; password: string }): Observable<AuthResponse> {
    const loginRequest: LoginRequest = {
      email: creds.email,
      password: creds.password
    };

    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/login`, loginRequest).pipe(
      map((response: LoginResponse) => {
        // Create a mock token since backend doesn't provide JWT
        const token = `token-${response.id}-${Date.now()}`;
        
        // Check if there's a temporary role from registration
        const tempRole = localStorage.getItem('temp_user_role');
        const userRole = tempRole || 'guest'; // Default to guest role (frontend role)
        
        if (tempRole) {
          localStorage.removeItem('temp_user_role'); // Clean up
        }
        
        const user: User = {
          id: response.id,
          name: localStorage.getItem('temp_user_name') || '', // Get name from temp storage
          email: response.email,
          role: userRole
        };

        const authResponse: AuthResponse = {
          token: token,
          user: user
        };

        return authResponse;
      }),
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_role', response.user.role || '');
        localStorage.setItem('user_id', response.user.id.toString());
        localStorage.setItem('user_email', response.user.email);
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Invalid email or password'));
      })
    );
  }


  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    // For now, return a mock response since backend doesn't have forgot password
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          message: 'Password reset instructions have been sent to your email.'
        });
        observer.complete();
      }, 800); // Simulate email sending delay
    });
  }

  register(user: { name: string; email: string; password: string }): Observable<boolean> {
    const registerRequest: RegisterRequest = {
      name: user.name,
      email: user.email,
      password: user.password
    };

    return this.http.post<RegisterResponse>(`${this.API_BASE_URL}/register`, registerRequest).pipe(
      map((response: RegisterResponse) => {
        // Store user data for later use
        localStorage.setItem('temp_user_id', response.id.toString());
        localStorage.setItem('temp_user_name', response.name);
        localStorage.setItem('temp_user_email', response.email);
        return true;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        if (error.status === 400) {
          return throwError(() => new Error('Email already exists'));
        }
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }

  selectRole(role: string): Observable<boolean> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      // Update current user
      const updatedUser = { ...currentUser, role };
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem('user_role', role);
      
      return of(true).pipe(delay(300));
    } else {
      // For users who just registered but aren't logged in yet
      // Store the role temporarily in localStorage
      localStorage.setItem('temp_user_role', role);
      return of(true).pipe(delay(300));
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('temp_user_id');
    localStorage.removeItem('temp_user_name');
    localStorage.removeItem('temp_user_email');
    localStorage.removeItem('temp_user_role');
    this.currentUserSubject.next(null);
    
    // Redirect to home page after logout
    this.router.navigate(['/home']);
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
    const userId = localStorage.getItem('user_id');
    const userEmail = localStorage.getItem('user_email');
    const userRole = localStorage.getItem('user_role');
    
    if (token && userId && userEmail) {
      const user: User = {
        id: parseInt(userId),
        name: localStorage.getItem('temp_user_name') || '', // Get name from temp storage
        email: userEmail,
        role: userRole || 'guest'
      };
      this.currentUserSubject.next(user);
    } else {
      this.logout();
    }
  }
}
