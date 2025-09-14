import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  credentials = { email: '', password: '' };
  forgotPasswordEmail = '';
  error = '';
  successMessage = '';
  isLoading = false;
  showForgotPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.successMessage = '';
    this.isLoading = true;
    
    this.auth.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        // Check if user has a role, if not redirect to role selection
        if (this.auth.hasRole()) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/role-selection']);
        }
      },
      error: () => {
        this.error = 'Invalid email or password.';
        this.isLoading = false;
      }
    });
  }


  forgotPassword() {
    if (!this.forgotPasswordEmail.trim()) {
      this.error = 'Please enter your email address.';
      return;
    }

    this.error = '';
    this.successMessage = '';
    this.isLoading = true;
    
    this.auth.forgotPassword(this.forgotPasswordEmail).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message;
          this.showForgotPassword = false;
          this.forgotPasswordEmail = '';
        } else {
          this.error = response.message;
        }
      },
      error: () => {
        this.error = 'Failed to process request. Please try again.';
        this.isLoading = false;
      }
    });
  }

  toggleForgotPassword() {
    this.showForgotPassword = !this.showForgotPassword;
    this.error = '';
    this.successMessage = '';
    this.forgotPasswordEmail = '';
  }
}