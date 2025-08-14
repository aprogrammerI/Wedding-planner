import { Component, OnInit } from '@angular/core';
import { BudgetService, Expense } from '../../services/budget.service';
import { VENDOR_CATEGORIES } from '../../services/vendor.service';
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
  newCategory: string = '';

  categorySlices: { category: string; amount: number; color: string; percent: number }[] = [];
  pieGradient = '';

  editingId: number | null = null;
  editDraft: Partial<Expense> = {};

  constructor(private svc: BudgetService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() { 
    this.svc.list().subscribe(x => {
      this.expenses = x;
      this.recomputeChart();
    }); 
  }

  add() {
    if (!this.newName.trim() || !this.newAmount) return;
    this.svc.add({ name: this.newName, amount: this.newAmount, category: this.newCategory || undefined })
      .subscribe(_ => { 
        this.newName = ''; 
        this.newAmount = 0; 
        this.newCategory = '';
        this.load(); 
      });
  }

  remove(id: number) { 
    this.svc.remove(id).subscribe(_ => this.load()); 
  }

  total() { 
    return this.expenses.reduce((sum, e) => sum + e.amount, 0); 
  }

  private recomputeChart() {
    const totals = new Map<string, number>();
    for (const e of this.expenses) {
      const key = e.category || 'Other';
      totals.set(key, (totals.get(key) || 0) + (Number(e.amount) || 0));
    }
    const totalAmount = Array.from(totals.values()).reduce((a, b) => a + b, 0);
    const palette = [
      '#A1B49A', '#FDAFA0', '#D3D8D5', '#E7AC96', '#ECC7BA', '#e29578',
      '#8FA287', '#FFD7CF', '#B2B8B5', '#7E8D75'
    ];
    const entries = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
    this.categorySlices = entries.map(([category, amount], idx) => ({
      category,
      amount,
      color: palette[idx % palette.length],
      percent: totalAmount ? (amount / totalAmount) * 100 : 0
    }));

    let current = 0;
    const segments: string[] = [];
    for (const s of this.categorySlices) {
      const start = current;
      const end = current + s.percent;
      segments.push(`${s.color} ${start}% ${end}%`);
      current = end;
    }
    this.pieGradient = segments.length
      ? `conic-gradient(${segments.join(',')})`
      : 'conic-gradient(#e9ecef 0 100%)';
  }

  get categories() {
    return VENDOR_CATEGORIES;
  }

  startEdit(expense: Expense) {
    this.editingId = expense.id;
    this.editDraft = { ...expense };
  }

  cancelEdit() {
    this.editingId = null;
    this.editDraft = {};
  }

  saveEdit() {
    if (this.editingId == null) return;
    const updated: Expense = {
      id: this.editingId,
      name: (this.editDraft.name || '').trim(),
      amount: Number(this.editDraft.amount) || 0,
      category: this.editDraft.category || undefined
    };
    if (!updated.name || !updated.amount) return;
    this.svc.update(updated).subscribe(() => {
      this.cancelEdit();
      this.load();
    });
  }
}