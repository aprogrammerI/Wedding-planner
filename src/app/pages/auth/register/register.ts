import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RoleOption } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  user = { name: '', email: '', password: '' };
  error = '';
  availableRoles: RoleOption[] = [];
  selectedRole: string | null = null;
  isRegistering = false;
  isRoleSelecting = false;
  showRoleSelection = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.availableRoles = this.auth.availableRoles;
  }

  register() {
    this.error = '';
    this.isRegistering = true;
    
    this.auth.register(this.user).subscribe({
      next: () => {
        this.isRegistering = false;
        // Show role selection after successful registration
        this.showRoleSelection = true;
      },
      error: (error) => {
        this.isRegistering = false;
        this.error = error.message || 'Registration failed. Please try again.';
      }
    });
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.isRoleSelecting = true;
    
    this.auth.selectRole(role).subscribe({
      next: (success) => {
        if (success) {
          this.isRoleSelecting = false;
          // After role selection, redirect to login
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Error selecting role:', error);
        this.isRoleSelecting = false;
      }
    });
  }

  getRoleIcon(role: RoleOption): string {
    return role.icon;
  }
}