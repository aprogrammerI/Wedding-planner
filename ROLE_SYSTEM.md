# Wedding App Role System

## Overview
The wedding app now includes a comprehensive role-based system that allows users to identify themselves and access appropriate features based on their role in the wedding planning process.

## Available Roles

### 1. Bride
- **Icon**: `assets/bride.png`
- **Description**: The bride-to-be
- **Access**: Full access to all wedding planning features

### 2. Groom
- **Icon**: `assets/groom.png`
- **Description**: The groom-to-be
- **Access**: Full access to all wedding planning features

### 3. Event Planner
- **Icon**: `assets/event-planner.png`
- **Description**: Professional wedding planner
- **Access**: Full access to all wedding planning features

### 4. Admin
- **Icon**: `assets/admin.png`
- **Description**: System administrator
- **Access**: Full system access and management capabilities

### 5. Other/User
- **Icon**: `assets/user.png`
- **Description**: Guest or other participant
- **Access**: Limited access to view-only features

## How It Works

### Authentication Flow
1. **Login/Register**: User authenticates with email and password
2. **Role Selection**: If user doesn't have a role, they're redirected to role selection page
3. **Dashboard Access**: Only after role selection can users access the main application

### Role Selection Page
- **Design**: Clean, centered layout with "Who are you?" heading
- **Role Cards**: Beautiful mini cards with icons, titles, and descriptions
- **Interactive**: Hover effects, selection states, and loading animations
- **Responsive**: Works on all device sizes

### Navigation
- **Before Role Selection**: Only shows login/register options
- **After Role Selection**: Shows full navigation menu with user info
- **User Info**: Displays name and role in the navbar

## Technical Implementation

### Services
- **AuthService**: Manages authentication and role selection
- **RoleGuard**: Protects routes requiring role selection
- **AuthGuard**: Protects routes requiring authentication

### Components
- **RoleSelection**: Main role selection interface
- **Updated Navbar**: Shows user role and appropriate navigation
- **Updated Guards**: Route protection based on authentication and role status

### Data Flow
1. User logs in/registers
2. AuthService checks if user has role
3. If no role: redirect to `/role-selection`
4. User selects role
5. Role is saved and user redirected to `/dashboard`
6. All protected routes now accessible

## Security Features
- **Route Protection**: Guards prevent unauthorized access
- **Role Persistence**: Roles stored in localStorage
- **Session Management**: Automatic role checking on app load

## Future Enhancements
- Role-based feature access control
- Different permissions per role
- Role switching capabilities
- Team collaboration features
