import { Component, OnInit } from '@angular/core';
import { BudgetService, Expense, BudgetDTO, BudgetCategoryDTO } from '../../services/budget.service';
import { VENDOR_CATEGORIES } from '../../services/vendor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-budget-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
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

  // Backend budget data
  budgetData: BudgetDTO | null = null;
  budget: number = 0;
  totalSpent: number = 0;
  remaining: number = 0;
  budgetKey = 'userBudget';

  categoryLimits: { [category: string]: number } = {};
  categoryLimitsKey = 'categoryLimits';
  categoryData: BudgetCategoryDTO[] = [];

  constructor(private svc: BudgetService) {}

  ngOnInit() {
    this.loadBudgetData();
    this.loadCategoryLimits();
    this.load();
  }

  loadBudgetData() {
    this.svc.getBudget().subscribe({
      next: (budgetDTO) => {
        this.budgetData = budgetDTO;
        this.budget = budgetDTO.totalBudget || 0;
        this.totalSpent = budgetDTO.totalSpent || 0;
        this.remaining = budgetDTO.remaining || 0;
        this.categoryData = budgetDTO.allCategoryDTOs || [];
        
        // Update category limits from backend data
        this.categoryData.forEach(category => {
          this.categoryLimits[this.mapCategoryTypeToString(category.categoryType)] = category.limit;
        });
        
        this.saveBudget();
        this.saveCategoryLimits();
      },
      error: (error) => {
        console.error('Error loading budget data:', error);
        // Fallback to localStorage if backend fails
        this.loadBudget();
      }
    });
  }

  loadBudget() {
    const val = localStorage.getItem(this.budgetKey);
    this.budget = val ? Number(val) : 0;
  }

  saveBudget() {
    localStorage.setItem(this.budgetKey, String(this.budget));
  }

  updateBudgetInBackend() {
    if (this.budgetData) {
      const updatedBudget: BudgetDTO = {
        ...this.budgetData,
        totalBudget: this.budget
      };
      
      this.svc.updateBudget(updatedBudget).subscribe({
        next: (budgetDTO) => {
          this.budgetData = budgetDTO;
          this.totalSpent = budgetDTO.totalSpent || 0;
          this.remaining = budgetDTO.remaining || 0;
        },
        error: (error) => {
          console.error('Error updating budget:', error);
          alert('Failed to update budget. Please try again.');
        }
      });
    }
  }

  loadCategoryLimits() {
    const val = localStorage.getItem(this.categoryLimitsKey);
    this.categoryLimits = val ? JSON.parse(val) : {};
  }

  saveCategoryLimits() {
    localStorage.setItem(this.categoryLimitsKey, JSON.stringify(this.categoryLimits));
  }

  setCategoryLimit(category: string, value: number) {
    this.categoryLimits[category] = value;
    this.saveCategoryLimits();
    
    // Update in backend
    const categoryType = this.mapStringToCategoryType(category);
    this.svc.updateCategoryLimit(categoryType, value).subscribe({
      next: (updatedCategory) => {
        console.log('Category limit updated:', updatedCategory);
      },
      error: (error) => {
        console.error('Error updating category limit:', error);
        alert('Failed to update category limit. Please try again.');
      }
    });
  }

  private mapCategoryTypeToString(categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES'): string {
    switch (categoryType) {
      case 'EVENT_PLANNING': return 'Event Planning';
      case 'PHOTOGRAPHY': return 'Photography';
      case 'CATERING': return 'Catering';
      case 'FLOWERS': return 'Flowers';
      case 'MUSIC': return 'Music';
      case 'VENUES': return 'Venues';
      default: return 'Other';
    }
  }

  private mapStringToCategoryType(category: string): 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES' {
    switch (category.toLowerCase()) {
      case 'event planning': return 'EVENT_PLANNING';
      case 'photography': return 'PHOTOGRAPHY';
      case 'catering': return 'CATERING';
      case 'flowers': return 'FLOWERS';
      case 'music': return 'MUSIC';
      case 'venues': return 'VENUES';
      default: return 'EVENT_PLANNING';
    }
  }

  getCategoryLimit(category: string): number {
    return this.categoryLimits[category] || 0;
  }

  isCategoryOverLimit(category: string, amount: number): boolean {
    const limit = this.getCategoryLimit(category);
    return limit > 0 && amount > limit;
  }

  get overBudget(): boolean {
    return this.totalSpent > this.budget && this.budget > 0;
  }

  get remainingBudget(): number {
    return this.remaining;
  }

  load() {
    this.svc.list().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.recomputeChart();
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
        alert('Failed to load expenses. Please try again.');
      }
    });
  }

  add() {
    if (!this.newName.trim() || !this.newAmount) return;
    this.svc.add({ name: this.newName, amount: this.newAmount, category: this.newCategory || undefined })
      .subscribe({
        next: () => {
          this.newName = '';
          this.newAmount = 0;
          this.newCategory = '';
          this.load();
          this.loadBudgetData(); // Refresh budget data
        },
        error: (error) => {
          console.error('Error adding expense:', error);
          alert('Failed to add expense. Please try again.');
        }
      });
  }

  remove(id: number) {
    this.svc.remove(id).subscribe({
      next: () => {
        this.load();
        this.loadBudgetData(); // Refresh budget data
      },
      error: (error) => {
        console.error('Error removing expense:', error);
        alert('Failed to remove expense. Please try again.');
      }
    });
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
    this.svc.update(updated).subscribe({
      next: () => {
        this.cancelEdit();
        this.load();
        this.loadBudgetData(); // Refresh budget data
      },
      error: (error) => {
        console.error('Error updating expense:', error);
        alert('Failed to update expense. Please try again.');
      }
    });
  }
}