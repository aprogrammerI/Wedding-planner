import { Routes } from '@angular/router';

export const routes: Routes = [
 { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/auth/register/register').then(m => m.Register)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  { 
    path: 'wedding-details', 
    loadComponent: () => import('./pages/wedding-details/wedding-details').then(m => m.WeddingDetails)
  },
  { 
    path: 'task-manager', 
    loadComponent: () => import('./pages/task-manager/task-manager').then(m => m.TaskManager)
  },
  { 
    path: 'guest-list', 
    loadComponent: () => import('./pages/guest-list/guest-list').then(m => m.GuestList)
  },
  { 
    path: 'budget-tracker', 
    loadComponent: () => import('./pages/budget-tracker/budget-tracker').then(m => m.BudgetTracker)
  },
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];
