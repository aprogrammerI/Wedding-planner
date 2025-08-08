import { Component, OnInit } from '@angular/core';
import { BudgetService, Expense } from '../../shared/budget.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-budget-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-tracker.html',
  styleUrls: ['./budget-tracker.scss']
})
export class BudgetTracker implements OnInit {
  expenses: Expense[] = [];
  newName = '';
  newAmount: number = 0;

  constructor(private svc: BudgetService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() { 
    this.svc.list().subscribe(x => this.expenses = x); 
  }

  add() {
    if (!this.newName.trim() || !this.newAmount) return;
    this.svc.add({ name: this.newName, amount: this.newAmount })
      .subscribe(_ => { 
        this.newName = ''; 
        this.newAmount = 0; 
        this.load(); 
      });
  }

  remove(id: number) { 
    this.svc.remove(id).subscribe(_ => this.load()); 
  }

  total() { 
    return this.expenses.reduce((sum, e) => sum + e.amount, 0); 
  }
}