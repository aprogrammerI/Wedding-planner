import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../shared/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-manager.html',
  styleUrls: ['./task-manager.scss']
})
export class TaskManager implements OnInit {
  tasks: Task[] = [];
  newTitle = '';
  newDescription = '';
  newDueDate = '';
  newPriority: Task['priority'] = 'medium';

  editingTaskId: number | null = null;
  editDraft: Partial<Task> = {};
  showAddForm = false;

  constructor(private svc: TaskService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() { 
    this.svc.list().subscribe(t => this.tasks = t); 
  }

  add() {
    if (!this.newTitle.trim()) return;
    this.svc.add({ 
        title: this.newTitle, 
        done: false,
        description: this.newDescription || undefined,
        dueDate: this.newDueDate || undefined,
        priority: this.newPriority
      })
      .subscribe(_ => { 
        this.newTitle = ''; 
        this.newDescription = '';
        this.newDueDate = '';
        this.newPriority = 'medium';
        this.showAddForm = false;
        this.load(); 
      });
  }

  toggle(t: Task) {
    t.done = !t.done;
    this.svc.update(t).subscribe();
  }

  onDoneChange(task: Task, checked: boolean) {
    const updated: Task = { ...task, done: checked };
    this.svc.update(updated).subscribe(() => {
      Object.assign(task, updated);
    });
  }

  remove(id: number) { 
    this.svc.remove(id).subscribe(_ => this.load()); 
  }

  startEdit(task: Task) {
    this.editingTaskId = task.id;
    this.editDraft = { ...task };
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
      dueDate: this.editDraft.dueDate || undefined,
      priority: (this.editDraft.priority as Task['priority']) || 'medium'
    };
    if (!updated.title) { return; }
    this.svc.update(updated).subscribe(_ => {
      this.cancelEdit();
      this.load();
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
  }
}