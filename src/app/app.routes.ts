import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { GuestList } from './pages/guest-list/guest-list';
import { TaskManager } from './pages/task-manager/task-manager';
import { Vendors } from './pages/vendors/vendors';
import { BudgetTracker } from './pages/budget-tracker/budget-tracker';
import { Rsvps } from './pages/rsvps/rsvps';
import { WeddingDetails } from './pages/wedding-details/wedding-details';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',       component: Home },
  { path: 'login',      component: Login },
  { path: 'register',   component: Register },
  { 
    path: 'dashboard',  
    component: Dashboard,
    canActivate: [AuthGuard]
  },
  { 
    path: 'guest-list', 
    component: GuestList,
    canActivate: [AuthGuard]
  },
  { 
    path: 'tasks',      
    component: TaskManager,
    canActivate: [AuthGuard]
  },
  { 
    path: 'vendors',    
    component: Vendors,
    canActivate: [AuthGuard]
  },
  { 
    path: 'budget-tracker', 
    component: BudgetTracker,
    canActivate: [AuthGuard]
  },
  { 
    path: 'rsvps',      
    component: Rsvps,
    canActivate: [AuthGuard]
  },
  { 
    path: 'wedding-details', 
    component: WeddingDetails,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'home' }
];
