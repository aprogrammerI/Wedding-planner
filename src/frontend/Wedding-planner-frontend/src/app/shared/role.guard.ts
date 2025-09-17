import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      if (this.authService.hasRole()) {
        return true;
      } else {
        // User is authenticated but hasn't selected a role
        this.router.navigate(['/role-selection']);
        return false;
      }
    } else {
      // User is not authenticated
      this.router.navigate(['/login']);
      return false;
    }
  }
}
