import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-manager.html',
  styleUrls: ['./task-manager.scss']
})
export class TaskManager {
  tasks = [
    { name: 'Book Venue', completed: true },
    { name: 'Send Invitations', completed: false }
  ];
}