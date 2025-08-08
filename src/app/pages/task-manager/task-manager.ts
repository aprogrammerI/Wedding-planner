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

  constructor(private svc: TaskService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() { 
    this.svc.list().subscribe(t => this.tasks = t); 
  }

  add() {
    if (!this.newTitle.trim()) return;
    this.svc.add({ title: this.newTitle, done: false })
      .subscribe(_ => { 
        this.newTitle = ''; 
        this.load(); 
      });
  }

  toggle(t: Task) {
    t.done = !t.done;
    this.svc.update(t).subscribe();
  }

  remove(id: number) { 
    this.svc.remove(id).subscribe(_ => this.load()); 
  }
}