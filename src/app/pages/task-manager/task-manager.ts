import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../services/auth.service';
import { VendorService, Vendor } from '../../services/vendor.service';
import { TaskService, Task, Subtask, OverdueReminder } from '../../services/task.service';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './task-manager.html',
  styleUrls: ['./task-manager.scss']
})
export class TaskManager implements OnInit {
  tasks: Task[] = [];
  newTitle = '';
  newDescription = '';
  newDueDate = '';
  newPriority: Task['priority'] = 'medium';
  newAssignedTo = '';
  newReminderDate = '';
  newReminderEnabled = false;

  editingTaskId: number | null = null;
  editDraft: Partial<Task> = {};
  showAddForm = false;
  isSortedByPriority = false;
  availableUsers: string[] = [];
  // overdueReminders: Task[] = [];
  overdueReminders: OverdueReminder[] = [];
  upcomingReminders: Task[] = [];
  selectedAssignee: string = '';
  showFilteredTasks = false;
  expandedTaskId: number | null = null;
  vendors: Vendor[] = [];


  constructor(
    public svc: TaskService,
    private authService: AuthService,
    private vendorService: VendorService
  ) {}

  ngOnInit() {
    this.loadVendors();
    this.load();
    this.loadAvailableUsers();
    this.loadOverdueReminders();

    // Refresh reminders every 5 minutes
    setInterval(() => {
      this.loadOverdueReminders();
    }, 5 * 60 * 1000);
  }

  loadVendors() {
    this.vendorService.list().subscribe(vs => this.vendors = vs);
  }

  load() {
    this.svc.list().subscribe(t => {
      this.tasks = t;
      this.loadOverdueReminders(); // Refresh reminders when tasks are loaded
    });
  }

  loadAvailableUsers() {
    // Get available users from auth service and add some common wedding roles
    this.availableUsers = [
      'Bride',
      'Groom',
      'Wedding Planner',
      'Other'
    ];
  }

  // loadReminders() {
  //   this.svc.getOverdueReminders().subscribe(tasks => this.overdueReminders = tasks);
  //   this.svc.getRemindersDueSoon().subscribe(tasks => this.upcomingReminders = tasks);
  // }

  loadOverdueReminders() {
    this.svc.getOverdueReminders().subscribe({
      next: (reminders) => {
        this.overdueReminders = reminders;
      },
      error: (error) => {
        console.error('Error loading overdue reminders:', error);
        this.overdueReminders = [];
      }
    });
  }

  refreshReminders() {
    this.loadOverdueReminders();
  }


     //ADDED
  assigneeLabel(a?: string): string {
    if (!a) return '';
    const map: Record<string, string> = {
      BRIDE: 'Bride',
      GROOM: 'Groom',
      PLANNER: 'Wedding Planner',
      OTHER: 'Other'
    };
    return map[a] || a;
  }



  // Sync reminder date with due date when due date changes
  onDueDateChange() {
    if (this.newReminderEnabled && this.newDueDate && !this.newReminderDate) {
      this.newReminderDate = this.newDueDate;
    }
  }

  // Sync reminder date with due date when reminder is enabled
  onReminderEnabledChange() {
    if (this.newReminderEnabled && this.newDueDate && !this.newReminderDate) {
      this.newReminderDate = this.newDueDate;
    }
  }

  add() {
    if (!this.newTitle.trim()) return;

    // If reminder is enabled but no reminder date is set, use the due date
    const reminderDate = this.newReminderEnabled && !this.newReminderDate && this.newDueDate
      ? this.newDueDate
      : this.newReminderDate || undefined;

    this.svc.add({
        title: this.newTitle,
        done: false,
        description: this.newDescription || undefined,
        dueDate: this.newDueDate || undefined,
        priority: this.newPriority,
        assignedTo: this.newAssignedTo || undefined,
        reminderDate: reminderDate,
        reminderEnabled: this.newReminderEnabled,
      })
      .subscribe({
        next: () => {
          this.newTitle = '';
          this.newDescription = '';
          this.newDueDate = '';
          this.newPriority = 'medium';
          this.newAssignedTo = '';
          this.newReminderDate = '';
          this.newReminderEnabled = false;
          this.showAddForm = false;
          this.load();
        },
        error: (error) => {
          console.error('Error adding task:', error);
          alert('Failed to add task. Please try again.');
        }
      });
  }

  toggle(t: Task) {
    t.done = !t.done;
    this.svc.update(t).subscribe({
      next: () => this.loadOverdueReminders(),
      error: (error) => {
        console.error('Error updating task:', error);
        t.done = !t.done; // Revert the change
        alert('Failed to update task. Please try again.');
      }
    });
  }

  onDoneChange(task: Task, checked: boolean) {
    const updated: Task = { ...task, done: checked };
    this.svc.update(updated).subscribe({
      next: () => {
        Object.assign(task, updated);
        this.loadOverdueReminders();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
      }
    });
  }

  remove(id: number) {
    this.svc.remove(id).subscribe({
      next: () => this.load(),
      error: (error) => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    });
  }

  startEdit(task: Task) {
    this.editingTaskId = task.id;
    this.editDraft = {
      ...task,
      reminderDate: task.dueDate || task.reminderDate, // Use due date as reminder date if available
      reminderEnabled: !!(task.dueDate || task.reminderEnabled) // Enable if there's a due date or reminder
    };
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.editDraft = {};
  }

  saveEdit() {
    if (this.editingTaskId == null) return;
    const updated: Task = {
      id: this.editingTaskId,
      title: (this.editDraft.title || '').trim(),
      done: !!this.editDraft.done,
      description: this.editDraft.description || undefined,
      dueDate: this.editDraft.reminderDate || undefined, // Use reminder date as due date
      priority: (this.editDraft.priority as Task['priority']) || 'medium',
      assignedTo: this.editDraft.assignedTo || undefined,
      reminderDate: this.editDraft.reminderDate || undefined,
      reminderEnabled: !!this.editDraft.reminderEnabled,
    };
    if (!updated.title) { return; }
    this.svc.update(updated).subscribe({
      next: () => {
        this.cancelEdit();
        this.load();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
      }
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newTitle = '';
    this.newDescription = '';
    this.newDueDate = '';
    this.newPriority = 'medium';
    this.newAssignedTo = '';
    this.newReminderDate = '';
    this.newReminderEnabled = false;
  }

  sortByPriority() {
    const rank: Record<NonNullable<Task['priority']>, number> = {
      high: 0,
      medium: 1,
      low: 2
    };
    this.tasks = [...this.tasks].sort((a, b) => {
      const ra = rank[(a.priority || 'medium') as NonNullable<Task['priority']>];
      const rb = rank[(b.priority || 'medium') as NonNullable<Task['priority']>];
      if (ra !== rb) return ra - rb;
      // Secondary sort by due date ascending if present
      const da = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      if (da !== db) return da - db;
      return a.title.localeCompare(b.title);
    });
    this.isSortedByPriority = true;
  }

  resetSort() {
    this.load();
    this.isSortedByPriority = false;
    this.selectedAssignee = '';
    this.showFilteredTasks = false;
  }

  getTasksByPriority(priority: Task['priority']): Task[] {
    return this.tasks.filter(task => (task.priority || 'medium') === priority);
  }

  getTasksByAssignee(assignee: string): Task[] {
    return this.tasks.filter(task => task.assignedTo === assignee);
  }

  getCompletedTasksByAssignee(assignee: string): Task[] {
    return this.tasks.filter(task => task.assignedTo === assignee && task.done);
  }

  getPendingTasksByAssignee(assignee: string): Task[] {
    return this.tasks.filter(task => task.assignedTo === assignee && !task.done);
  }

  getTaskCompletionPercentage(assignee: string): number {
    const totalTasks = this.getTasksByAssignee(assignee).length;
    if (totalTasks === 0) return 0;
    const completedTasks = this.getCompletedTasksByAssignee(assignee).length;
    return Math.round((completedTasks / totalTasks) * 100);
  }

  getCompletedTasks(): Task[] {
    return this.tasks.filter(task => task.done);
  }

  getPendingTasks(): Task[] {
    return this.tasks.filter(task => !task.done);
  }

  getOverallTaskCompletionPercentage(): number {
    if (this.tasks.length === 0) return 0;
    const completedTasks = this.getCompletedTasks().length;
    return Math.round((completedTasks / this.tasks.length) * 100);
  }

  filterByAssignee(assignee: string) {
    this.selectedAssignee = assignee;
    this.showFilteredTasks = true;
    this.isSortedByPriority = false;
  }

  clearAssigneeFilter() {
    this.selectedAssignee = '';
    this.showFilteredTasks = false;
  }

  getPriorityDisplayName(priority: Task['priority']): string {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Medium Priority';
    }
  }

  // Check if reminder is due soon (within 3 days)
  isReminderDueSoon(task: Task): boolean {
    if (!task.reminderDate || !task.reminderEnabled) return false;
    const reminderDate = new Date(task.reminderDate);
    const today = new Date();
    const diffTime = reminderDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  }

  // Check if reminder is overdue
  isReminderOverdue(task: Task): boolean {
    if (!task.reminderDate || !task.reminderEnabled) return false;
    const reminderDate = new Date(task.reminderDate);
    const today = new Date();
    return reminderDate < today;
  }

  // Get reminder status text
  getReminderStatus(task: Task): string {
    if (!task.reminderDate || !task.reminderEnabled) return '';

    const reminderDate = new Date(task.reminderDate);
    const today = new Date();
    const diffTime = reminderDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day(s)`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 3) {
      return `Due in ${diffDays} days`;
    } else {
      return `Due in ${diffDays} days`;
    }
  }

  addSubtask(task: Task) {
    const subtaskTitle = prompt('Enter subtask title:');
    if (subtaskTitle && subtaskTitle.trim()) {
      this.svc.addSubtask(task.id, subtaskTitle.trim()).subscribe({
        next: () => {
          this.load(); // Refresh the task list
        },
        error: (error) => {
          console.error('Error adding subtask:', error);
          alert('Failed to add subtask. Please try again.');
        }
      });
    }
  }

  toggleExpandTask(task: Task) {
    this.expandedTaskId = this.expandedTaskId === task.id ? null : task.id;
  }

  getSubtaskCount(task: Task): number {
    return task.subtasks ? task.subtasks.length : 0;
  }

  getCompletedSubtaskCount(task: Task): number {
    return task.subtasks ? task.subtasks.filter(st => st.done).length : 0;
  }

  editSubtask(task: Task, sub: any) {
    const newTitle = prompt('Edit subtask title:', sub.title);
    if (newTitle && newTitle.trim() && newTitle !== sub.title) {
      this.svc.updateSubtask(task.id, sub.id, { title: newTitle.trim() }).subscribe({
        next: (updated) => {
          sub.title = updated.title;
        },
        error: (error) => {
          console.error('Error updating subtask:', error);
          alert('Failed to update subtask. Please try again.');
        }
      });
    }
  }

  deleteSubtask(task: Task, sub: any) {
    if (confirm('Delete this subtask?')) {
      this.svc.deleteSubtask(task.id, sub.id).subscribe({
        next: () => {
          this.load(); // Refresh the task list
        },
        error: (error) => {
          console.error('Error deleting subtask:', error);
          alert('Failed to delete subtask. Please try again.');
        }
      });
    }
  }

  getVendorById(id: number | undefined): Vendor | undefined {
    return this.vendors.find(v => v.id === id);
  }

  // Method to handle subtask status updates with proper error handling
  updateSubtaskStatus(task: Task, subtask: Subtask) {
    this.svc.updateSubtask(task.id, subtask.id, { done: subtask.done }).subscribe({
      next: () => {
        console.log('Subtask status updated successfully');
      },
      error: (error) => {
        console.error('Error updating subtask status:', error);
        // Revert the change if update fails
        subtask.done = !subtask.done;
        alert('Failed to update subtask status. Please try again.');
      }
    });
  }

}
