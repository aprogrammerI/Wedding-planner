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
    // AuthService will handle the redirect to home page
  }

  getRoleIcon(): string {
    const currentRole = this.authService.getCurrentUserRole();
    if (currentRole) {
      // Find role in available roles
      const roleOption = this.authService.availableRoles.find(role => role.role === currentRole);
      return roleOption ? roleOption.icon : 'assets/user.png';
    }
    return 'assets/user.png';
  }
}
