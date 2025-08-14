import { Component, OnInit } from '@angular/core';
import { VendorService, Vendor } from '../../services/vendor.service';
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
  vendors: Vendor[] = [];
  newVendor: Partial<Vendor> = {};
  editingVendor: Vendor | null = null;
  showAddForm = false;
  showEditForm = false;
  tasks: Task[] = [];

  constructor(private svc: VendorService, private taskService: TaskService) {}

  ngOnInit() {
    this.load();
    this.loadTasks();
  }

  load() {
    this.svc.list().subscribe(v => this.vendors = v);
  }

  loadTasks() {
    this.taskService.list().subscribe(ts => this.tasks = ts);
  }

  getTasksForVendor(vendorId: number): Task[] {
    return this.tasks.filter(t => t.vendorId === vendorId);
  }

  getUnassignedTasks(): Task[] {
    return this.tasks.filter(t => !t.vendorId);
  }

  assignTaskToVendor(task: Task, vendorId: number) {
    const updated = { ...task, vendorId };
    this.taskService.update(updated).subscribe(() => this.loadTasks());
  }

  unassignTaskFromVendor(task: Task) {
    const updated = { ...task, vendorId: undefined };
    this.taskService.update(updated).subscribe(() => this.loadTasks());
  }

  handleAssignTaskToVendor(event: Event, vendorId: number) {
    const select = event.target as HTMLSelectElement;
    const taskId = Number(select.value);
    if (!taskId) return;
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.assignTaskToVendor(task, vendorId);
      select.value = '';
    }
  }

  add() {
    if (!this.newVendor.name || !this.newVendor.category) return;
    
    this.svc.add(this.newVendor as Omit<Vendor, 'id'>).subscribe(() => {
      this.newVendor = {};
      this.showAddForm = false;
      this.load();
    });
  }

  edit(vendor: Vendor) {
    this.editingVendor = { ...vendor };
    this.showEditForm = true;
  }

  update() {
    if (!this.editingVendor) return;
    
    this.svc.update(this.editingVendor).subscribe(() => {
      this.editingVendor = null;
      this.showEditForm = false;
      this.load();
    });
  }

  remove(id: number) {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.svc.remove(id).subscribe(() => this.load());
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
