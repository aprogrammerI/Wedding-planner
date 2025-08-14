import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { RoleSelection } from './pages/role-selection/role-selection';
import { Dashboard } from './pages/dashboard/dashboard';
import { GuestList } from './pages/guest-list/guest-list';
import { TaskManager } from './pages/task-manager/task-manager';
import { Vendors } from './pages/vendors/vendors';
import { BudgetTracker } from './pages/budget-tracker/budget-tracker';
import { Rsvps } from './pages/rsvps/rsvps';
import { WeddingDetails } from './pages/wedding-details/wedding-details';
import { Collaboration } from './pages/collaboration/collaboration';
import { AuthGuard } from './shared/auth.guard';
import { RoleGuard } from './shared/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',       component: Home },
  { path: 'login',      component: Login },
  { path: 'register',   component: Register },
  { 
    path: 'role-selection',  
    component: RoleSelection,
    canActivate: [AuthGuard]
  },
  { 
    path: 'dashboard',  
    component: Dashboard,
    canActivate: [RoleGuard]
  },
  { 
    path: 'guest-list', 
    component: GuestList,
    canActivate: [RoleGuard]
  },
  { 
    path: 'tasks',      
    component: TaskManager,
    canActivate: [RoleGuard]
  },
  { 
    path: 'vendors',    
    component: Vendors,
    canActivate: [RoleGuard]
  },
  { 
    path: 'budget-tracker', 
    component: BudgetTracker,
    canActivate: [RoleGuard]
  },
  { 
    path: 'rsvps',      
    component: Rsvps,
    canActivate: [RoleGuard]
  },
  { 
    path: 'wedding-details', 
    component: WeddingDetails,
    canActivate: [RoleGuard]
  },
  { 
    path: 'collaboration', 
    component: Collaboration,
    canActivate: [RoleGuard]
  },
  { path: '**', redirectTo: 'home' }
];
