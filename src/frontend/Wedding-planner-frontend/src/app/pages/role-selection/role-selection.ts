import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, RoleOption } from '../../services/auth.service';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-selection.html',
  styleUrls: ['./role-selection.scss']
})
export class RoleSelection implements OnInit {
  availableRoles: RoleOption[] = [];
  selectedRole: string | null = null;
  isSelecting = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.availableRoles = this.authService.availableRoles;
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.isSelecting = true;
    
    this.authService.selectRole(role).subscribe({
      next: (success) => {
        if (success) {
          // Navigate to home page after role selection
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Error selecting role:', error);
        this.isSelecting = false;
      }
    });
  }

  getRoleIcon(role: RoleOption): string {
    return role.icon;
  }
}
