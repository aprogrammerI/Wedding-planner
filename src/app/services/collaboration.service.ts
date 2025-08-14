import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from './auth.service';

export interface Invitation {
  id: string;
  fromUserId: number;
  fromUserName: string;
  toEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  role: string;
  weddingId: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface Collaboration {
  id: string;
  weddingId: string;
  users: Collaborator[];
  permissions: Permission[];
}

export interface Collaborator {
  userId: number;
  name: string;
  email: string;
  role: string;
  joinedAt: Date;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'view' | 'edit' | 'manage';
}

export interface WeddingProject {
  id: string;
  name: string;
  description: string;
  ownerId: number;
  collaborators: Collaborator[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class CollaborationService {
  private invitationsSubject = new BehaviorSubject<Invitation[]>([]);
  private collaborationsSubject = new BehaviorSubject<Collaboration[]>([]);
  private weddingProjectsSubject = new BehaviorSubject<WeddingProject[]>([]);

  public invitations$ = this.invitationsSubject.asObservable();
  public collaborations$ = this.collaborationsSubject.asObservable();
  public weddingProjects$ = this.weddingProjectsSubject.asObservable();

  // Mock data for demonstration
  private mockInvitations: Invitation[] = [
    {
      id: 'inv-1',
      fromUserId: 1,
      fromUserName: 'John Doe',
      toEmail: 'jane@example.com',
      status: 'pending',
      role: 'bride',
      weddingId: 'wedding-1',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  ];

  private mockCollaborations: Collaboration[] = [
    {
      id: 'collab-1',
      weddingId: 'wedding-1',
      users: [
        {
          userId: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'groom',
          joinedAt: new Date(),
          permissions: ['view', 'edit', 'manage']
        },
        {
          userId: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'bride',
          joinedAt: new Date(),
          permissions: ['view', 'edit', 'manage']
        }
      ],
      permissions: [
        {
          id: 'perm-1',
          name: 'Full Access',
          description: 'Can view, edit, and manage all aspects',
          category: 'manage'
        },
        {
          id: 'perm-2',
          name: 'Edit Access',
          description: 'Can view and edit content',
          category: 'edit'
        },
        {
          id: 'perm-3',
          name: 'View Only',
          description: 'Can only view content',
          category: 'view'
        }
      ]
    }
  ];

  private mockWeddingProjects: WeddingProject[] = [
    {
      id: 'wedding-1',
      name: 'John & Jane\'s Wedding',
      description: 'Our special day celebration',
      ownerId: 1,
      collaborators: [
        {
          userId: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'groom',
          joinedAt: new Date(),
          permissions: ['view', 'edit', 'manage']
        },
        {
          userId: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'bride',
          joinedAt: new Date(),
          permissions: ['view', 'edit', 'manage']
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() {
    this.invitationsSubject.next(this.mockInvitations);
    this.collaborationsSubject.next(this.mockCollaborations);
    this.weddingProjectsSubject.next(this.mockWeddingProjects);
  }

  // Send invitation to collaborate
  sendInvitation(invitation: Omit<Invitation, 'id' | 'status' | 'createdAt' | 'expiresAt'>): Observable<Invitation> {
    const newInvitation: Invitation = {
      ...invitation,
      id: `inv-${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    return of(newInvitation).pipe(
      delay(500),
      tap(inv => {
        this.mockInvitations.push(inv);
        this.invitationsSubject.next([...this.mockInvitations]);
      })
    );
  }

  // Accept invitation
  acceptInvitation(invitationId: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      tap(() => {
        const invitation = this.mockInvitations.find(inv => inv.id === invitationId);
        if (invitation) {
          invitation.status = 'accepted';
          
          // Add user to collaboration
          this.addUserToCollaboration(invitation);
          
          this.invitationsSubject.next([...this.mockInvitations]);
        }
      })
    );
  }

  // Decline invitation
  declineInvitation(invitationId: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      tap(() => {
        const invitation = this.mockInvitations.find(inv => inv.id === invitationId);
        if (invitation) {
          invitation.status = 'declined';
          this.invitationsSubject.next([...this.mockInvitations]);
        }
      })
    );
  }

  // Get invitations for a user
  getInvitationsForUser(email: string): Observable<Invitation[]> {
    const userInvitations = this.mockInvitations.filter(inv => inv.toEmail === email);
    return of(userInvitations);
  }

  // Get collaborations for a user
  getUserCollaborations(userId: number): Observable<Collaboration[]> {
    const userCollaborations = this.mockCollaborations.filter(collab => 
      collab.users.some(user => user.userId === userId)
    );
    return of(userCollaborations);
  }

  // Get wedding projects for a user
  getUserWeddingProjects(userId: number): Observable<WeddingProject[]> {
    const userProjects = this.mockWeddingProjects.filter(project => 
      project.ownerId === userId || 
      project.collaborators.some(collab => collab.userId === userId)
    );
    return of(userProjects);
  }

  // Create new wedding project
  createWeddingProject(project: Omit<WeddingProject, 'id' | 'createdAt' | 'updatedAt'>): Observable<WeddingProject> {
    const newProject: WeddingProject = {
      ...project,
      id: `wedding-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return of(newProject).pipe(
      delay(500),
      tap(project => {
        this.mockWeddingProjects.push(project);
        this.weddingProjectsSubject.next([...this.mockWeddingProjects]);
      })
    );
  }

  // Add user to collaboration
  private addUserToCollaboration(invitation: Invitation): void {
    const collaboration = this.mockCollaborations.find(collab => collab.weddingId === invitation.weddingId);
    if (collaboration) {
      const newCollaborator: Collaborator = {
        userId: Date.now(), // Mock user ID
        name: invitation.toEmail.split('@')[0], // Extract name from email
        email: invitation.toEmail,
        role: invitation.role,
        joinedAt: new Date(),
        permissions: ['view', 'edit'] // Default permissions
      };
      
      collaboration.users.push(newCollaborator);
      this.collaborationsSubject.next([...this.mockCollaborations]);
    }
  }

  // Remove user from collaboration
  removeCollaborator(weddingId: string, userId: number): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      tap(() => {
        const collaboration = this.mockCollaborations.find(collab => collab.weddingId === weddingId);
        if (collaboration) {
          collaboration.users = collaboration.users.filter(user => user.userId !== userId);
          this.collaborationsSubject.next([...this.mockCollaborations]);
        }
      })
    );
  }

  // Update user permissions
  updateUserPermissions(weddingId: string, userId: number, permissions: string[]): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      tap(() => {
        const collaboration = this.mockCollaborations.find(collab => collab.weddingId === weddingId);
        if (collaboration) {
          const user = collaboration.users.find(u => u.userId === userId);
          if (user) {
            user.permissions = permissions;
            this.collaborationsSubject.next([...this.mockCollaborations]);
          }
        }
      })
    );
  }
}
