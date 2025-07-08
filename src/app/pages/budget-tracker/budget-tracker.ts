import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-tracker.html',
  styleUrls: ['./budget-tracker.scss']
})
export class BudgetTracker {
  budget = 10000;
  expenses = 4500;
}