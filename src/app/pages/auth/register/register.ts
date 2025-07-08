import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  user = { name: '', email: '', password: '' };

  constructor(private router: Router) {}

  register() {
    // Add registration logic
    this.router.navigate(['/dashboard']);
  }
}