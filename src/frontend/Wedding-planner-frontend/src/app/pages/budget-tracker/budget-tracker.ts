





import { Component, OnInit } from '@angular/core';
import { BudgetService, Expense, BudgetDTO, BudgetCategoryDTO } from '../../services/budget.service';
import { VENDOR_CATEGORIES } from '../../services/vendor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

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

  budgetData: BudgetDTO | null = null;
  budget: number = 0;
  totalSpent: number = 0;
  remaining: number = 0;
  budgetKey = 'userBudget';

  categoryLimits: { [category: string]: number } = {};
  categoryLimitsKey = 'categoryLimits';
  categoryData: BudgetCategoryDTO[] = [];

  private budgetChange$ = new Subject<number>();

  constructor(private svc: BudgetService) {}

  ngOnInit() {
    console.log('[BudgetTracker] init userId=', localStorage.getItem('user_id'));
    this.loadBudgetData();
    this.loadCategoryLimits();

    // Debounced auto-save of total budget to backend
    this.budgetChange$
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(val => {
          if (!this.budgetData) return of(null);
          const dto: BudgetDTO = { ...this.budgetData, totalBudget: Number(val) };
          console.log('[BudgetTracker] debounced PUT /api/budget', dto);
          return this.svc.updateBudget(dto).pipe(
            catchError(err => {
              console.error('[BudgetTracker] auto PUT failed', err);
              return of(null);
            })
          );
        })
      )
      .subscribe(res => {
        if (res) {
          console.log('[BudgetTracker] auto PUT response', res);
          this.budgetData = res;
          this.budget = res.totalBudget || 0;
          this.totalSpent = res.totalSpent || 0;
          this.remaining = res.remaining || 0;
        }
      });
  }

  // Called by (ngModelChange) on the input
  onBudgetChange(val: number) {
    this.budget = Number(val) || 0;
    this.budgetChange$.next(this.budget);
    this.saveBudget(); // keep local fallback in sync
  }




  loadBudgetData() {
    console.log('[BudgetTracker] GET /api/budget');
    this.svc.getBudget().subscribe({
      next: (budgetDTO) => {
        console.log('[BudgetTracker] budgetDTO=', budgetDTO);
        this.budgetData = budgetDTO;
        this.budget = budgetDTO.totalBudget || 0;
        this.totalSpent = budgetDTO.totalSpent || 0;
        this.remaining = budgetDTO.remaining || 0;
        this.categoryData = budgetDTO.allCategoryDTOs || [];

        // Reset and fully hydrate from backend (accept 0 values)
        this.categoryLimits = {};
        this.categoryData.forEach(category => {
          const key = category.categoryType; // e.g., EVENT_PLANNING
          this.categoryLimits[key] = category.limit ?? 0;
        });

        this.saveBudget();
        this.saveCategoryLimits();

        // Sequence items fetch after budget loaded
        this.load();
      },
      error: (error) => {
        console.error('[BudgetTracker] GET /api/budget failed', error);
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

  // Manual save if you keep a Save button elsewhere
  updateBudgetInBackend() {
    if (!this.budgetData) return;
    const updatedBudget: BudgetDTO = { ...this.budgetData, totalBudget: this.budget };
    console.log('[BudgetTracker] PUT /api/budget payload=', updatedBudget);
    this.svc.updateBudget(updatedBudget).subscribe({
      next: (budgetDTO) => {
        console.log('[BudgetTracker] PUT /api/budget response=', budgetDTO);
        this.budgetData = budgetDTO;
        this.totalSpent = budgetDTO.totalSpent || 0;
        this.remaining = budgetDTO.remaining || 0;
      },
      error: (error) => {
        console.error('[BudgetTracker] PUT /api/budget failed', error);
        alert('Failed to update budget. Please try again.');
      }
    });
  }

  loadCategoryLimits() {
    const val = localStorage.getItem(this.categoryLimitsKey);
    this.categoryLimits = val ? JSON.parse(val) : {};
  }

  saveCategoryLimits() {
    localStorage.setItem(this.categoryLimitsKey, JSON.stringify(this.categoryLimits));
  }


  setCategoryLimit(categoryLabel: string, value: any) {
    const v = value === '' || value == null ? NaN : Number(value);
    if (!Number.isFinite(v)) return;

    const key = this.mapStringToCategoryType(categoryLabel);
    this.categoryLimits[key] = v;
    this.saveCategoryLimits();

    this.svc.updateCategoryLimit(key as any, v).subscribe({
      next: (updatedCategory) => {
        const entry = this.categoryData.find(c => c.categoryType === key);
        if (entry) entry.limit = v;
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




  public mapStringToCategoryType(category: string): 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES' {
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


  getCategoryLimit(categoryLabel: string): number {
    const key = this.mapStringToCategoryType(categoryLabel);
    return this.categoryLimits[key] || 0;
  }



  isCategoryOverLimit(categoryLabel: string, amount: number): boolean {
    const key = this.mapStringToCategoryType(categoryLabel);
    const limit = this.categoryLimits[key] || 0;
    return limit > 0 && amount > limit;
  }

  get overBudget(): boolean {
    return this.totalSpent > this.budget && this.budget > 0;
  }

  get remainingBudget(): number {
    return this.remaining;
  }

  load() {
    console.log('[BudgetTracker] GET /api/budget (list items via svc.list)');
    this.svc.list().subscribe({
      next: (expenses) => {
        console.log('[BudgetTracker] list expenses=', expenses);
        this.expenses = expenses;
        this.recomputeChart();
      },
      error: (error) => {
        console.error('[BudgetTracker] list failed', error);
        alert('Failed to load expenses. Please try again.');
      }
    });
  }

  add() {
    //if (!this.newName.trim() || !this.newAmount) return;

    if (!this.newName.trim() || !this.newAmount || !this.newCategory) return;

    console.log('[BudgetTracker] POST /api/budget/items via svc.add payload=', {
      name: this.newName, amount: this.newAmount, category: this.newCategory
    });
    this.svc.add({ name: this.newName, amount: this.newAmount, category: this.newCategory || undefined })
      .subscribe({
        next: () => {
          console.log('[BudgetTracker] add item success; refreshing');
          this.newName = '';
          this.newAmount = 0;
          this.newCategory = '';
          this.load();
          this.loadBudgetData(); // Refresh budget totals and categories
        },
        error: (error) => {
          console.error('[BudgetTracker] add item failed', error);
          alert('Failed to add expense. Please try again.');
        }
      });
  }

  remove(id: number) {
    console.log('[BudgetTracker] DELETE /api/budget/items/' + id);
    this.svc.remove(id).subscribe({
      next: () => {
        this.load();
        this.loadBudgetData();
      },
      error: (error) => {
        console.error('[BudgetTracker] remove failed', error);
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
    console.log('[BudgetTracker] PUT /api/budget/items/' + this.editingId, updated);
    this.svc.update(updated).subscribe({
      next: () => {
        this.cancelEdit();
        this.load();
        this.loadBudgetData();
      },
      error: (error) => {
        console.error('[BudgetTracker] update failed', error);
        alert('Failed to update expense. Please try again.');
      }
    });
  }
}








