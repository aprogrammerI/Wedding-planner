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
  // user = { name: '', email: '', password: '' };
  user: { name: string; email: string; password: string } = { name: '', email: '', password: '' };
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

// Validation methods
  isFormValid(): boolean {
    return this.isValidName() && this.isValidEmail() && this.isValidPassword();
  }

  isValidName(): boolean {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return this.user.name.length >= 2 && this.user.name.length <= 50 && nameRegex.test(this.user.name);
  }

  isValidEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.user.email);
  }

  isValidPassword(): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,50}$/;
    return this.user.password.length >= 8 && this.user.password.length <= 50 && passwordRegex.test(this.user.password);
  }

  // Password strength methods
  getPasswordStrength(): number {
    if (!this.user.password) return 0;

    let strength = 0;
    const password = this.user.password;

    // Length check
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;

    // Character type checks
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/\d/.test(password)) strength += 15;
    if (/[@$!%*?&]/.test(password)) strength += 15;

    // Bonus for complexity
    if (password.length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)) {
      strength += 10;
    }

    return Math.min(strength, 100);
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 30) return 'strength-weak';
    if (strength < 60) return 'strength-medium';
    if (strength < 80) return 'strength-good';
    return 'strength-strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Medium';
    if (strength < 80) return 'Good';
    return 'Strong';
  }
}
