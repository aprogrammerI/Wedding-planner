import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { CollaborationService, Invitation, WeddingProject, Collaborator } from '../../services/collaboration.service';

@Component({
  selector: 'app-collaboration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collaboration.html',
  styleUrls: ['./collaboration.scss']
})
export class Collaboration implements OnInit {
  currentUser: User | null = null;
  invitations: Invitation[] = [];
  weddingProjects: WeddingProject[] = [];
  showInviteForm = false;
  showCreateProjectForm = false;
  
  // Invitation form
  newInvitation = {
    toEmail: '',
    role: '',
    weddingId: '',
    projectName: ''
  };

  // Project creation form
  newProject = {
    name: '',
    description: ''
  };

  availableRoles = [
    { value: 'bride', label: 'Bride' },
    { value: 'groom', label: 'Groom' },
    { value: 'event-planner', label: 'Event Planner' },
    { value: 'family-member', label: 'Family Member' },
    { value: 'friend', label: 'Friend' }
  ];

  constructor(
    private authService: AuthService,
    private collaborationService: CollaborationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData() {
    if (this.currentUser) {
      // Load user's invitations
      this.collaborationService.getInvitationsForUser(this.currentUser.email).subscribe(
        invitations => this.invitations = invitations
      );

      // Load user's wedding projects
      this.collaborationService.getUserWeddingProjects(this.currentUser.id).subscribe(
        projects => this.weddingProjects = projects
      );
    }
  }

  sendInvitation() {
    if (!this.newInvitation.toEmail || !this.newInvitation.role) {
      return;
    }

    if (this.currentUser) {
      const invitation = {
        fromUserId: this.currentUser.id,
        fromUserName: this.currentUser.name,
        toEmail: this.newInvitation.toEmail,
        role: this.newInvitation.role,
        weddingId: this.newInvitation.weddingId || 'default-wedding'
      };

      this.collaborationService.sendInvitation(invitation).subscribe({
        next: () => {
          this.showInviteForm = false;
          this.newInvitation = { toEmail: '', role: '', weddingId: '', projectName: '' };
          this.loadData();
        },
        error: (error) => console.error('Error sending invitation:', error)
      });
    }
  }

  acceptInvitation(invitation: Invitation) {
    this.collaborationService.acceptInvitation(invitation.id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (error) => console.error('Error accepting invitation:', error)
    });
  }

  declineInvitation(invitation: Invitation) {
    this.collaborationService.declineInvitation(invitation.id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (error) => console.error('Error declining invitation:', error)
    });
  }

  createWeddingProject() {
    if (!this.newProject.name.trim()) {
      return;
    }

    if (this.currentUser) {
      const project = {
        name: this.newProject.name,
        description: this.newProject.description,
        ownerId: this.currentUser.id,
        collaborators: [{
          userId: this.currentUser.id,
          name: this.currentUser.name,
          email: this.currentUser.email,
          role: this.currentUser.role || 'user',
          joinedAt: new Date(),
          permissions: ['view', 'edit', 'manage']
        }]
      };

      this.collaborationService.createWeddingProject(project).subscribe({
        next: () => {
          this.showCreateProjectForm = false;
          this.newProject = { name: '', description: '' };
          this.loadData();
        },
        error: (error) => console.error('Error creating project:', error)
      });
    }
  }

  getInvitationStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'badge bg-warning';
      case 'accepted': return 'badge bg-success';
      case 'declined': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getPermissionBadgeClass(permission: string): string {
    switch (permission) {
      case 'manage': return 'badge bg-danger';
      case 'edit': return 'badge bg-warning';
      case 'view': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }

  toggleInviteForm() {
    this.showInviteForm = !this.showInviteForm;
    if (!this.showInviteForm) {
      this.newInvitation = { toEmail: '', role: '', weddingId: '', projectName: '' };
    }
  }

  toggleCreateProjectForm() {
    this.showCreateProjectForm = !this.showCreateProjectForm;
    if (!this.showCreateProjectForm) {
      this.newProject = { name: '', description: '' };
    }
  }
}
