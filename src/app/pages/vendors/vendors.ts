import { Component, OnInit } from '@angular/core';
import { VendorService, Vendor, VendorDTO, TaskSummaryDTO } from '../../services/vendor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './vendors.html',
  styleUrls: ['./vendors.scss']
})
export class Vendors implements OnInit {
  vendors: VendorDTO[] = [];
  newVendor: Partial<Vendor> = {};
  editingVendor: Vendor | null = null;
  showAddForm = false;
  showEditForm = false;
  tasks: Task[] = [];
  availableTasks: { [vendorId: number]: TaskSummaryDTO[] } = {};

  constructor(private svc: VendorService, private taskService: TaskService) {}

  ngOnInit() {
    this.load();
    this.loadTasks();
  }

  load() {
    this.svc.list().subscribe({
      next: (vendors) => {
        this.vendors = vendors;
        // Load available tasks for each vendor
        this.vendors.forEach(vendor => {
          this.loadAvailableTasks(vendor.id);
        });
      },
      error: (error) => {
        console.error('Error loading vendors:', error);
        alert('Failed to load vendors. Please try again.');
      }
    });
  }

  loadTasks() {
    this.taskService.list().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        alert('Failed to load tasks. Please try again.');
      }
    });
  }

  loadAvailableTasks(vendorId: number) {
    this.svc.getAvailableTasks(vendorId).subscribe({
      next: (tasks) => {
        this.availableTasks[vendorId] = tasks;
      },
      error: (error) => {
        console.error('Error loading available tasks:', error);
        this.availableTasks[vendorId] = [];
      }
    });
  }

  getTasksForVendor(vendorId: number): TaskSummaryDTO[] {
    const vendor = this.vendors.find(v => v.id === vendorId);
    return vendor?.assignedTasks || [];
  }

  getAvailableTasksForVendor(vendorId: number): TaskSummaryDTO[] {
    return this.availableTasks[vendorId] || [];
  }

  assignTaskToVendor(taskId: number, vendorId: number) {
    this.svc.assignTask(vendorId, taskId).subscribe({
      next: () => {
        // Refresh available tasks for this vendor
        this.loadAvailableTasks(vendorId);
        // Refresh all tasks
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error assigning task to vendor:', error);
        alert('Failed to assign task to vendor. Please try again.');
      }
    });
  }

  unassignTaskFromVendor(taskId: number, vendorId: number) {
    this.svc.unassignTask(vendorId, taskId).subscribe({
      next: () => {
        // Refresh available tasks for this vendor
        this.loadAvailableTasks(vendorId);
        // Refresh all tasks
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error unassigning task from vendor:', error);
        alert('Failed to unassign task from vendor. Please try again.');
      }
    });
  }

  handleAssignTaskToVendor(event: Event, vendorId: number) {
    const select = event.target as HTMLSelectElement;
    const taskId = Number(select.value);
    if (!taskId) return;
    
    this.assignTaskToVendor(taskId, vendorId);
    select.value = '';
  }

  add() {
    if (!this.newVendor.name || !this.newVendor.category) return;
    
    this.svc.add(this.newVendor as Omit<Vendor, 'id'>).subscribe({
      next: () => {
        this.newVendor = {};
        this.showAddForm = false;
        this.load();
      },
      error: (error) => {
        console.error('Error adding vendor:', error);
        alert('Failed to add vendor. Please try again.');
      }
    });
  }

  edit(vendor: Vendor) {
    this.editingVendor = { ...vendor };
    this.showEditForm = true;
  }

  update() {
    if (!this.editingVendor) return;
    
    this.svc.update(this.editingVendor).subscribe({
      next: () => {
        this.editingVendor = null;
        this.showEditForm = false;
        this.load();
      },
      error: (error) => {
        console.error('Error updating vendor:', error);
        alert('Failed to update vendor. Please try again.');
      }
    });
  }

  remove(id: number) {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.svc.remove(id).subscribe({
        next: () => this.load(),
        error: (error) => {
          console.error('Error deleting vendor:', error);
          alert('Failed to delete vendor. Please try again.');
        }
      });
    }
  }

  cancelEdit() {
    this.editingVendor = null;
    this.showEditForm = false;
  }

  cancelAdd() {
    this.newVendor = {};
    this.showAddForm = false;
  }
}
