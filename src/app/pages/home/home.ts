import { Component }       from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterLink }      from '@angular/router';

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
export class Home {
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
    },
    { 
      title: 'Dashboard', 
      text: 'Get an overview of all your wedding planning progress and upcoming tasks.', 
      link: '/dashboard', 
      cta: 'Dashboard →' 
    }
  ];
}
