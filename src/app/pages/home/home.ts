import { Component, OnInit }       from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterLink, Router }      from '@angular/router';
import { AuthService }     from '../../services/auth.service';

interface Card {
  title: string;
  text: string;
  link: string;
  cta: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  isAuthenticated = false;
  hasRole = false;
  
  cards: Card[] = [
    { 
      title: 'Guest List', 
      text: 'All you\'ll need to create a comprehensive wedding guest list, including dietary requirements, preferences & even RSVPs.', 
      link: '/guest-list', 
      cta: 'Wedding Guest List →' 
    },
    { 
      title: 'Wedding Checklist', 
      text: 'Create an easy-to-manage wedding checklist that\'ll help you tick off tasks quicker, and delegate jobs with ease.', 
      link: '/task-manager', 
      cta: 'Wedding Checklist →' 
    },
    { 
      title: 'Budget Calculator', 
      text: 'Keep on top of your wedding budget with our essential calculator and planner. An effortless way to manage vendor costs.', 
      link: '/budget-tracker', 
      cta: 'Budget Calculator →' 
    },
    { 
      title: 'Wedding Details', 
      text: 'Manage all your wedding details in one place - venue, date, theme, and more.', 
      link: '/wedding-details', 
      cta: 'Wedding Details →' 
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuthStatus();
    // Subscribe to auth changes to make it reactive
    this.authService.currentUser$.subscribe(() => {
      this.checkAuthStatus();
    });
  }

  checkAuthStatus() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.hasRole = this.authService.hasRole();
  }

  onCreateProject() {
    if (this.isAuthenticated) {
      // If logged in, go to wedding details
      this.router.navigate(['/wedding-details']);
    } else {
      // If not logged in, go to register
      this.router.navigate(['/register']);
    }
  }

  onSignIn() {
    this.router.navigate(['/login']);
  }
}
