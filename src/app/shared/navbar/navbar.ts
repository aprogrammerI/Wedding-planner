import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, RoleOption } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  isMenuOpen = false;
  
  constructor(public authService: AuthService, private router: Router) {}
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  logout() {
    this.authService.logout();
  }

  getRoleIcon(): string {
    const currentRole = this.authService.getCurrentUserRole();
    if (currentRole) {
      // Special handling for admin role
      if (currentRole === 'admin') {
        return 'assets/admin.png';
      }
      
      // For other roles, find in available roles
      const roleOption = this.authService.availableRoles.find(role => role.role === currentRole);
      return roleOption ? roleOption.icon : 'assets/user.png';
    }
    return 'assets/user.png';
  }
}
