

//1


// // // // import { Component, OnInit } from '@angular/core';
// // // // import { BudgetService, Expense, BudgetDTO, BudgetCategoryDTO } from '../../services/budget.service';
// // // // import { VENDOR_CATEGORIES } from '../../services/vendor.service';
// // // // import { CommonModule } from '@angular/common';
// // // // import { FormsModule } from '@angular/forms';
// // // // import { MatIconModule } from '@angular/material/icon';
// // // //
// // // // @Component({
// // // //   selector: 'app-budget-tracker',
// // // //   standalone: true,
// // // //   imports: [CommonModule, FormsModule, MatIconModule],
// // // //   templateUrl: './budget-tracker.html',
// // // //   styleUrls: ['./budget-tracker.scss']
// // // // })
// // // // export class BudgetTracker implements OnInit {
// // // //   expenses: Expense[] = [];
// // // //   newName = '';
// // // //   newAmount: number = 0;
// // // //   newCategory: string = '';
// // // //
// // // //   categorySlices: { category: string; amount: number; color: string; percent: number }[] = [];
// // // //   pieGradient = '';
// // // //
// // // //   editingId: number | null = null;
// // // //   editDraft: Partial<Expense> = {};
// // // //
// // // //   // Backend budget data
// // // //   budgetData: BudgetDTO | null = null;
// // // //   budget: number = 0;
// // // //   totalSpent: number = 0;
// // // //   remaining: number = 0;
// // // //   budgetKey = 'userBudget';
// // // //
// // // //   categoryLimits: { [category: string]: number } = {};
// // // //   categoryLimitsKey = 'categoryLimits';
// // // //   categoryData: BudgetCategoryDTO[] = [];
// // // //
// // // //   constructor(private svc: BudgetService) {}
// // // //
// // // //   ngOnInit() {
// // // //     this.loadBudgetData();
// // // //     this.loadCategoryLimits();
// // // //     this.load();
// // // //   }
// // // //
// // // //   loadBudgetData() {
// // // //     this.svc.getBudget().subscribe({
// // // //       next: (budgetDTO) => {
// // // //         this.budgetData = budgetDTO;
// // // //         this.budget = budgetDTO.totalBudget || 0;
// // // //         this.totalSpent = budgetDTO.totalSpent || 0;
// // // //         this.remaining = budgetDTO.remaining || 0;
// // // //         this.categoryData = budgetDTO.allCategoryDTOs || [];
// // // //
// // // //         // Update category limits from backend data
// // // //         this.categoryData.forEach(category => {
// // // //           this.categoryLimits[this.mapCategoryTypeToString(category.categoryType)] = category.limit;
// // // //         });
// // // //
// // // //         this.saveBudget();
// // // //         this.saveCategoryLimits();
// // // //       },
// // // //       error: (error) => {
// // // //         console.error('Error loading budget data:', error);
// // // //         // Fallback to localStorage if backend fails
// // // //         this.loadBudget();
// // // //       }
// // // //     });
// // // //   }
// // // //
// // // //   loadBudget() {
// // // //     const val = localStorage.getItem(this.budgetKey);
// // // //     this.budget = val ? Number(val) : 0;
// // // //   }
// // // //
// // // //   saveBudget() {
// // // //     localStorage.setItem(this.budgetKey, String(this.budget));
// // // //   }
// // // //
// // // //   updateBudgetInBackend() {
// // // //     if (this.budgetData) {
// // // //       const updatedBudget: BudgetDTO = {
// // // //         ...this.budgetData,
// // // //         totalBudget: this.budget
// // // //       };
// // // //
// // // //       this.svc.updateBudget(updatedBudget).subscribe({
// // // //         next: (budgetDTO) => {
// // // //           this.budgetData = budgetDTO;
// // // //           this.totalSpent = budgetDTO.totalSpent || 0;
// // // //           this.remaining = budgetDTO.remaining || 0;
// // // //         },
// // // //         error: (error) => {
// // // //           console.error('Error updating budget:', error);
// // // //           alert('Failed to update budget. Please try again.');
// // // //         }
// // // //       });
// // // //     }
// // // //   }
// // // //
// // // //   loadCategoryLimits() {
// // // //     const val = localStorage.getItem(this.categoryLimitsKey);
// // // //     this.categoryLimits = val ? JSON.parse(val) : {};
// // // //   }
// // // //
// // // //   saveCategoryLimits() {
// // // //     localStorage.setItem(this.categoryLimitsKey, JSON.stringify(this.categoryLimits));
// // // //   }
// // // //
// // // //   setCategoryLimit(category: string, value: number) {
// // // //     this.categoryLimits[category] = value;
// // // //     this.saveCategoryLimits();
// // // //
// // // //     // Update in backend
// // // //     const categoryType = this.mapStringToCategoryType(category);
// // // //     this.svc.updateCategoryLimit(categoryType, value).subscribe({
// // // //       next: (updatedCategory) => {
// // // //         console.log('Category limit updated:', updatedCategory);
// // // //       },
// // // //       error: (error) => {
// // // //         console.error('Error updating category limit:', error);
// // // //         alert('Failed to update category limit. Please try again.');
// // // //       }
// // // //     });
// // // //   }
// // // //
// // // //   private mapCategoryTypeToString(categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES'): string {
// // // //     switch (categoryType) {
// // // //       case 'EVENT_PLANNING': return 'Event Planning';
// // // //       case 'PHOTOGRAPHY': return 'Photography';
// // // //       case 'CATERING': return 'Catering';
// // // //       case 'FLOWERS': return 'Flowers';
// // // //       case 'MUSIC': return 'Music';
// // // //       case 'VENUES': return 'Venues';
// // // //       default: return 'Other';
// // // //     }
// // // //   }
// // // //
// // // //   private mapStringToCategoryType(category: string): 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES' {
// // // //     switch (category.toLowerCase()) {
// // // //       case 'event planning': return 'EVENT_PLANNING';
// // // //       case 'photography': return 'PHOTOGRAPHY';
// // // //       case 'catering': return 'CATERING';
// // // //       case 'flowers': return 'FLOWERS';
// // // //       case 'music': return 'MUSIC';
// // // //       case 'venues': return 'VENUES';
// // // //       default: return 'EVENT_PLANNING';
// // // //     }
// // // //   }
// // // //
// // // //   getCategoryLimit(category: string): number {
// // // //     return this.categoryLimits[category] || 0;
// // // //   }
// // // //
// // // //   isCategoryOverLimit(category: string, amount: number): boolean {
// // // //     const limit = this.getCategoryLimit(category);
// // // //     return limit > 0 && amount > limit;
// // // //   }
// // // //
// // // //   get overBudget(): boolean {
// // // //     return this.totalSpent > this.budget && this.budget > 0;
// // // //   }
// // // //
// // // //   get remainingBudget(): number {
// // // //     return this.remaining;
// // // //   }
// // // //
// // // //   load() {
// // // //     this.svc.list().subscribe({
// // // //       next: (expenses) => {
// // // //         this.expenses = expenses;
// // // //         this.recomputeChart();
// // // //       },
// // // //       error: (error) => {
// // // //         console.error('Error loading expenses:', error);
// // // //         alert('Failed to load expenses. Please try again.');
// // // //       }
// // // //     });
// // // //   }
// // // //
// // // //   add() {
// // // //     if (!this.newName.trim() || !this.newAmount) return;
// // // //     this.svc.add({ name: this.newName, amount: this.newAmount, category: this.newCategory || undefined })
// // // //       .subscribe({
// // // //         next: () => {
// // // //           this.newName = '';
// // // //           this.newAmount = 0;
// // // //           this.newCategory = '';
// // // //           this.load();
// // // //           this.loadBudgetData(); // Refresh budget data
// // // //         },
// // // //         error: (error) => {
// // // //           console.error('Error adding expense:', error);
// // // //           alert('Failed to add expense. Please try again.');
// // // //         }
// // // //       });
// // // //   }
// // // //
// // // //   remove(id: number) {
// // // //     this.svc.remove(id).subscribe({
// // // //       next: () => {
// // // //         this.load();
// // // //         this.loadBudgetData(); // Refresh budget data
// // // //       },
// // // //       error: (error) => {
// // // //         console.error('Error removing expense:', error);
// // // //         alert('Failed to remove expense. Please try again.');
// // // //       }
// // // //     });
// // // //   }
// // // //
// // // //   total() {
// // // //     return this.expenses.reduce((sum, e) => sum + e.amount, 0);
// // // //   }
// // // //
// // // //   private recomputeChart() {
// // // //     const totals = new Map<string, number>();
// // // //     for (const e of this.expenses) {
// // // //       const key = e.category || 'Other';
// // // //       totals.set(key, (totals.get(key) || 0) + (Number(e.amount) || 0));
// // // //     }
// // // //     const totalAmount = Array.from(totals.values()).reduce((a, b) => a + b, 0);
// // // //     const palette = [
// // // //       '#A1B49A', '#FDAFA0', '#D3D8D5', '#E7AC96', '#ECC7BA', '#e29578',
// // // //       '#8FA287', '#FFD7CF', '#B2B8B5', '#7E8D75'
// // // //     ];
// // // //     const entries = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
// // // //     this.categorySlices = entries.map(([category, amount], idx) => ({
// // // //       category,
// // // //       amount,
// // // //       color: palette[idx % palette.length],
// // // //       percent: totalAmount ? (amount / totalAmount) * 100 : 0
// // // //     }));
// // // //
// // // //     let current = 0;
// // // //     const segments: string[] = [];
// // // //     for (const s of this.categorySlices) {
// // // //       const start = current;
// // // //       const end = current + s.percent;
// // // //       segments.push(`${s.color} ${start}% ${end}%`);
// // // //       current = end;
// // // //     }
// // // //     this.pieGradient = segments.length
// // // //       ? `conic-gradient(${segments.join(',')})`
// // // //       : 'conic-gradient(#e9ecef 0 100%)';
// // // //   }
// // // //
// // // //   get categories() {
// // // //     return VENDOR_CATEGORIES;
// // // //   }
// // // //
// // // //   startEdit(expense: Expense) {
// // // //     this.editingId = expense.id;
// // // //     this.editDraft = { ...expense };
// // // //   }
// // // //
// // // //   cancelEdit() {
// // // //     this.editingId = null;
// // // //     this.editDraft = {};
// // // //   }
// // // //
// // // //   saveEdit() {
// // // //     if (this.editingId == null) return;
// // // //     const updated: Expense = {
// // // //       id: this.editingId,
// // // //       name: (this.editDraft.name || '').trim(),
// // // //       amount: Number(this.editDraft.amount) || 0,
// // // //       category: this.editDraft.category || undefined
// // // //     };
// // // //     if (!updated.name || !updated.amount) return;
// // // //     this.svc.update(updated).subscribe({
// // // //       next: () => {
// // // //         this.cancelEdit();
// // // //         this.load();
// // // //         this.loadBudgetData(); // Refresh budget data
// // // //       },
// // // //       error: (error) => {
// // // //         console.error('Error updating expense:', error);
// // // //         alert('Failed to update expense. Please try again.');
// // // //       }
// // // //     });
// // // //   }
// // // // }
// // //





//2






// // // import { Component, OnInit } from '@angular/core';
// // // import { BudgetService, Expense, BudgetDTO, BudgetCategoryDTO } from '../../services/budget.service';
// // // import { VENDOR_CATEGORIES } from '../../services/vendor.service';
// // // import { CommonModule } from '@angular/common';
// // // import { FormsModule } from '@angular/forms';
// // // import { MatIconModule } from '@angular/material/icon';
// // //
// // // @Component({
// // //   selector: 'app-budget-tracker',
// // //   standalone: true,
// // //   imports: [CommonModule, FormsModule, MatIconModule],
// // //   templateUrl: './budget-tracker.html',
// // //   styleUrls: ['./budget-tracker.scss']
// // // })
// // // export class BudgetTracker implements OnInit {
// // //   expenses: Expense[] = [];
// // //   newName = '';
// // //   newAmount: number = 0;
// // //   newCategory: string = '';
// // //
// // //   categorySlices: { category: string; amount: number; color: string; percent: number }[] = [];
// // //   pieGradient = '';
// // //
// // //   editingId: number | null = null;
// // //   editDraft: Partial<Expense> = {};
// // //
// // //   budgetData: BudgetDTO | null = null;
// // //   budget: number = 0;
// // //   totalSpent: number = 0;
// // //   remaining: number = 0;
// // //   budgetKey = 'userBudget';
// // //
// // //   categoryLimits: { [category: string]: number } = {};
// // //   categoryLimitsKey = 'categoryLimits';
// // //   categoryData: BudgetCategoryDTO[] = [];
// // //
// // //   constructor(private svc: BudgetService) {}
// // //
// // //   ngOnInit() {
// // //     console.log('[BudgetTracker] init userId=', localStorage.getItem('user_id'));
// // //     this.loadBudgetData();
// // //     this.loadCategoryLimits();
// // //     this.load();
// // //   }
// // //
// // //   loadBudgetData() {
// // //     console.log('[BudgetTracker] GET /api/budget');
// // //     this.svc.getBudget().subscribe({
// // //       next: (budgetDTO) => {
// // //         console.log('[BudgetTracker] budgetDTO=', budgetDTO);
// // //         this.budgetData = budgetDTO;
// // //         this.budget = budgetDTO.totalBudget || 0;
// // //         this.totalSpent = budgetDTO.totalSpent || 0;
// // //         this.remaining = budgetDTO.remaining || 0;
// // //         this.categoryData = budgetDTO.allCategoryDTOs || [];
// // //
// // //         this.categoryData.forEach(category => {
// // //           this.categoryLimits[this.mapCategoryTypeToString(category.categoryType)] = category.limit;
// // //         });
// // //
// // //         this.saveBudget();
// // //         this.saveCategoryLimits();
// // //       },
// // //       error: (error) => {
// // //         console.error('[BudgetTracker] GET /api/budget failed', error);
// // //         this.loadBudget();
// // //       }
// // //     });
// // //   }
// // //
// // //   loadBudget() {
// // //     const val = localStorage.getItem(this.budgetKey);
// // //     this.budget = val ? Number(val) : 0;
// // //   }
// // //
// // //   saveBudget() {
// // //     localStorage.setItem(this.budgetKey, String(this.budget));
// // //   }
// // //
// // //   updateBudgetInBackend() {
// // //     if (this.budgetData) {
// // //       const updatedBudget: BudgetDTO = {
// // //         ...this.budgetData,
// // //         totalBudget: this.budget
// // //       };
// // //       console.log('[BudgetTracker] PUT /api/budget payload=', updatedBudget);
// // //       this.svc.updateBudget(updatedBudget).subscribe({
// // //         next: (budgetDTO) => {
// // //           console.log('[BudgetTracker] PUT /api/budget response=', budgetDTO);
// // //           this.budgetData = budgetDTO;
// // //           this.totalSpent = budgetDTO.totalSpent || 0;
// // //           this.remaining = budgetDTO.remaining || 0;
// // //         },
// // //         error: (error) => {
// // //           console.error('[BudgetTracker] PUT /api/budget failed', error);
// // //           alert('Failed to update budget. Please try again.');
// // //         }
// // //       });
// // //     }
// // //   }
// // //
// // //   loadCategoryLimits() {
// // //     const val = localStorage.getItem(this.categoryLimitsKey);
// // //     this.categoryLimits = val ? JSON.parse(val) : {};
// // //   }
// // //
// // //   saveCategoryLimits() {
// // //     localStorage.setItem(this.categoryLimitsKey, JSON.stringify(this.categoryLimits));
// // //   }
// // //
// // //   setCategoryLimit(category: string, value: number) {
// // //     this.categoryLimits[category] = value;
// // //     this.saveCategoryLimits();
// // //
// // //     const categoryType = this.mapStringToCategoryType(category);
// // //     console.log('[BudgetTracker] PATCH /api/budget/categories limit payload=', { categoryType, value });
// // //     this.svc.updateCategoryLimit(categoryType, value).subscribe({
// // //       next: (updatedCategory) => {
// // //         console.log('[BudgetTracker] PATCH /api/budget/categories response=', updatedCategory);
// // //       },
// // //       error: (error) => {
// // //         console.error('[BudgetTracker] PATCH /api/budget/categories failed', error);
// // //         alert('Failed to update category limit. Please try again.');
// // //       }
// // //     });
// // //   }
// // //
// // //   private mapCategoryTypeToString(categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES'): string {
// // //     switch (categoryType) {
// // //       case 'EVENT_PLANNING': return 'Event Planning';
// // //       case 'PHOTOGRAPHY': return 'Photography';
// // //       case 'CATERING': return 'Catering';
// // //       case 'FLOWERS': return 'Flowers';
// // //       case 'MUSIC': return 'Music';
// // //       case 'VENUES': return 'Venues';
// // //       default: return 'Other';
// // //     }
// // //   }
// // //
// // //   private mapStringToCategoryType(category: string): 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES' {
// // //     switch (category.toLowerCase()) {
// // //       case 'event planning': return 'EVENT_PLANNING';
// // //       case 'photography': return 'PHOTOGRAPHY';
// // //       case 'catering': return 'CATERING';
// // //       case 'flowers': return 'FLOWERS';
// // //       case 'music': return 'MUSIC';
// // //       case 'venues': return 'VENUES';
// // //       default: return 'EVENT_PLANNING';
// // //     }
// // //   }
// // //
// // //   getCategoryLimit(category: string): number {
// // //     return this.categoryLimits[category] || 0;
// // //   }
// // //
// // //   isCategoryOverLimit(category: string, amount: number): boolean {
// // //     const limit = this.getCategoryLimit(category);
// // //     return limit > 0 && amount > limit;
// // //   }
// // //
// // //   get overBudget(): boolean {
// // //     return this.totalSpent > this.budget && this.budget > 0;
// // //   }
// // //
// // //   get remainingBudget(): number {
// // //     return this.remaining;
// // //   }
// // //
// // //   load() {
// // //     console.log('[BudgetTracker] GET /api/budget (list items via svc.list)');
// // //     this.svc.list().subscribe({
// // //       next: (expenses) => {
// // //         console.log('[BudgetTracker] list expenses=', expenses);
// // //         this.expenses = expenses;
// // //         this.recomputeChart();
// // //       },
// // //       error: (error) => {
// // //         console.error('[BudgetTracker] list failed', error);
// // //         alert('Failed to load expenses. Please try again.');
// // //       }
// // //     });
// // //   }
// // //
// // //   add() {
// // //     if (!this.newName.trim() || !this.newAmount) return;
// // //     console.log('[BudgetTracker] POST /api/budget/items via svc.add payload=', {
// // //       name: this.newName, amount: this.newAmount, category: this.newCategory
// // //     });
// // //     this.svc.add({ name: this.newName, amount: this.newAmount, category: this.newCategory || undefined })
// // //       .subscribe({
// // //         next: () => {
// // //           console.log('[BudgetTracker] add item success; refreshing');
// // //           this.newName = '';
// // //           this.newAmount = 0;
// // //           this.newCategory = '';
// // //           this.load();
// // //           this.loadBudgetData();
// // //         },
// // //         error: (error) => {
// // //           console.error('[BudgetTracker] add item failed', error);
// // //           alert('Failed to add expense. Please try again.');
// // //         }
// // //       });
// // //   }
// // //
// // //   remove(id: number) {
// // //     console.log('[BudgetTracker] DELETE /api/budget/items/' + id);
// // //     this.svc.remove(id).subscribe({
// // //       next: () => {
// // //         this.load();
// // //         this.loadBudgetData();
// // //       },
// // //       error: (error) => {
// // //         console.error('[BudgetTracker] remove failed', error);
// // //         alert('Failed to remove expense. Please try again.');
// // //       }
// // //     });
// // //   }
// // //
// // //   total() {
// // //     return this.expenses.reduce((sum, e) => sum + e.amount, 0);
// // //   }
// // //
// // //   private recomputeChart() {
// // //     const totals = new Map<string, number>();
// // //     for (const e of this.expenses) {
// // //       const key = e.category || 'Other';
// // //       totals.set(key, (totals.get(key) || 0) + (Number(e.amount) || 0));
// // //     }
// // //     const totalAmount = Array.from(totals.values()).reduce((a, b) => a + b, 0);
// // //     const palette = [
// // //       '#A1B49A', '#FDAFA0', '#D3D8D5', '#E7AC96', '#ECC7BA', '#e29578',
// // //       '#8FA287', '#FFD7CF', '#B2B8B5', '#7E8D75'
// // //     ];
// // //     const entries = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
// // //     this.categorySlices = entries.map(([category, amount], idx) => ({
// // //       category,
// // //       amount,
// // //       color: palette[idx % palette.length],
// // //       percent: totalAmount ? (amount / totalAmount) * 100 : 0
// // //     }));
// // //
// // //     let current = 0;
// // //     const segments: string[] = [];
// // //     for (const s of this.categorySlices) {
// // //       const start = current;
// // //       const end = current + s.percent;
// // //       segments.push(`${s.color} ${start}% ${end}%`);
// // //       current = end;
// // //     }
// // //     this.pieGradient = segments.length
// // //       ? `conic-gradient(${segments.join(',')})`
// // //       : 'conic-gradient(#e9ecef 0 100%)';
// // //   }
// // //
// // //   get categories() {
// // //     return VENDOR_CATEGORIES;
// // //   }
// // //
// // //   startEdit(expense: Expense) {
// // //     this.editingId = expense.id;
// // //     this.editDraft = { ...expense };
// // //   }
// // //
// // //   cancelEdit() {
// // //     this.editingId = null;
// // //     this.editDraft = {};
// // //   }
// // //
// // //   saveEdit() {
// // //     if (this.editingId == null) return;
// // //     const updated: Expense = {
// // //       id: this.editingId,
// // //       name: (this.editDraft.name || '').trim(),
// // //       amount: Number(this.editDraft.amount) || 0,
// // //       category: this.editDraft.category || undefined
// // //     };
// // //     if (!updated.name || !updated.amount) return;
// // //     console.log('[BudgetTracker] PUT /api/budget/items/' + this.editingId, updated);
// // //     this.svc.update(updated).subscribe({
// // //       next: () => {
// // //         this.cancelEdit();
// // //         this.load();
// // //         this.loadBudgetData();
// // //       },
// // //       error: (error) => {
// // //         console.error('[BudgetTracker] update failed', error);
// // //         alert('Failed to update expense. Please try again.');
// // //       }
// // //     });
// // //   }
// // // }
// //
// // //






//3



// // // import { Subject } from 'rxjs';
// // // import { debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
// // //
// // // private budgetChange$ = new Subject<number>();
// // //
// // // ngOnInit() {
// // //   this.loadBudgetData(); // ensure you don't call load() here; call it inside loadBudgetData() after GET returns
// // //
// // //   this.budgetChange$
// // //     .pipe(
// // //       debounceTime(600),
// // //       distinctUntilChanged(),
// // //       switchMap(val => {
// // //         if (!this.budgetData) return of(null);
// // //         const dto = { ...this.budgetData, totalBudget: Number(val) };
// // //         console.log('[BudgetTracker] debounced PUT /api/budget', dto);
// // //         return this.svc.updateBudget(dto).pipe(
// // //           catchError(err => {
// // //             console.error('[BudgetTracker] auto PUT failed', err);
// // //             return of(null);
// // //           })
// // //         );
// // //       })
// // //     )
// // //     .subscribe(res => {
// // //       if (res) {
// // //         this.budgetData = res;
// // //         this.budget = res.totalBudget || 0;
// // //         this.totalSpent = res.totalSpent || 0;
// // //         this.remaining = res.remaining || 0;
// // //       }
// // //     });
// // // }
// // //
// // // onBudgetChange(val: number) {
// // //   this.budget = Number(val) || 0;
// // //   this.budgetChange$.next(this.budget);
// // // }
// // //
// // // loadBudgetData() {
// // //   console.log('[BudgetTracker] GET /api/budget');
// // //   this.svc.getBudget().subscribe({
// // //     next: (budgetDTO) => {
// // //       console.log('[BudgetTracker] budgetDTO=', budgetDTO);
// // //       this.budgetData = budgetDTO;
// // //       this.budget = budgetDTO.totalBudget || 0;
// // //       this.totalSpent = budgetDTO.totalSpent || 0;
// // //       this.remaining = budgetDTO.remaining || 0;
// // //       this.categoryData = budgetDTO.allCategoryDTOs || [];
// // //       this.categoryData.forEach(c => {
// // //         this.categoryLimits[this.mapCategoryTypeToString(c.categoryType)] = c.limit;
// // //       });
// // //       this.saveBudget();
// // //       this.saveCategoryLimits();
// // //       this.load(); // sequence items fetch after budget loaded
// // //     },
// // //     error: (err) => {
// // //       console.error('[BudgetTracker] GET /api/budget failed', err);
// // //       this.loadBudget();
// // //     }
// // //   });
// // // }
// //
// //



//4






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

        // this.categoryData.forEach(category => {
        //   this.categoryLimits[this.mapCategoryTypeToString(category.categoryType)] = category.limit;
        //
        // });

        // Update category limits from backend data, but don't overwrite with 0s
        // this.categoryData.forEach(category => {
        //   const key = this.mapCategoryTypeToString(category.categoryType);
        //   const serverLimit = category.limit ?? 0;
        //   const existing = this.categoryLimits[key];
        //   this.categoryLimits[key] = serverLimit > 0 ? serverLimit : (existing ?? 0);
        // });

        // Update category limits from backend data, but don't overwrite with 0s
        this.categoryData.forEach(category => {
          const key = category.categoryType; // enum key (EVENT_PLANNING, ...)
          const serverLimit = category.limit ?? 0;
          const existing = this.categoryLimits[key];
          this.categoryLimits[key] = serverLimit > 0 ? serverLimit : (existing ?? 0);
        });

        this.saveBudget();
        this.saveCategoryLimits();

        // Sequence items fetch after budget loaded to avoid parallel calls
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

  // setCategoryLimit(category: string, value: number) {
  //   this.categoryLimits[category] = value;
  //   this.saveCategoryLimits();
  //
  //   const categoryType = this.mapStringToCategoryType(category);
  //   console.log('[BudgetTracker] PATCH /api/budget/categories limit payload=', { categoryType, value });
  //   this.svc.updateCategoryLimit(categoryType, value).subscribe({
  //     next: (updatedCategory) => {
  //       console.log('[BudgetTracker] PATCH /api/budget/categories response=', updatedCategory);
  //     },
  //     error: (error) => {
  //       console.error('[BudgetTracker] PATCH /api/budget/categories failed', error);
  //       alert('Failed to update category limit. Please try again.');
  //     }
  //   });
  // }


  // setCategoryLimit(category: string, value: any) {
  //   const v = value === '' || value == null ? NaN : Number(value);
  //   if (!Number.isFinite(v)) return; // ignore empty/invalid
  //
  //   this.categoryLimits[category] = v;
  //   this.saveCategoryLimits();
  //
  //   const categoryType = this.mapStringToCategoryType(category);
  //   this.svc.updateCategoryLimit(categoryType, v).subscribe({
  //     next: (updatedCategory) => {
  //       console.log('Category limit updated:', updatedCategory);
  //     },
  //     error: (error) => {
  //       console.error('Error updating category limit:', error);
  //       alert('Failed to update category limit. Please try again.');
  //     }
  //   });
  // }


  // setCategoryLimit(category: string, value: any) {
  //   const v = value === '' || value == null ? NaN : Number(value);
  //   if (!Number.isFinite(v)) return; // ignore empty/invalid
  //
  //   this.categoryLimits[category] = v;
  //   this.saveCategoryLimits();
  //
  //   const categoryType = this.mapStringToCategoryType(category);
  //   this.svc.updateCategoryLimit(categoryType, v).subscribe({
  //     next: (updatedCategory) => {
  //       const entry = this.categoryData.find(c => c.categoryType === categoryType);
  //       if (entry) entry.limit = v; // reflect new limit locally
  //     },
  //     error: (error) => {
  //       console.error('Error updating category limit:', error);
  //       alert('Failed to update category limit. Please try again.');
  //     }
  //   });
  // }


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

  // private mapStringToCategoryType(category: string): 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES' {
  //   switch (category.toLowerCase()) {
  //     case 'event planning': return 'EVENT_PLANNING';
  //     case 'photography': return 'PHOTOGRAPHY';
  //     case 'catering': return 'CATERING';
  //     case 'flowers': return 'FLOWERS';
  //     case 'music': return 'MUSIC';
  //     case 'venues': return 'VENUES';
  //     default: return 'EVENT_PLANNING';
  //   }
  // }


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

  // getCategoryLimit(category: string): number {
  //   return this.categoryLimits[category] || 0;
  // }

  getCategoryLimit(categoryLabel: string): number {
    const key = this.mapStringToCategoryType(categoryLabel);
    return this.categoryLimits[key] || 0;
  }

  // isCategoryOverLimit(category: string, amount: number): boolean {
  //   const limit = this.getCategoryLimit(category);
  //   return limit > 0 && amount > limit;
  // }

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








//5


// // // frontend/Wedding-planner-frontend/src/app/pages/budget-tracker/budget-tracker.ts
// // import { Component, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { MatIconModule } from '@angular/material/icon';
// // import { BudgetService, BudgetDTO, BudgetItemDTO, BudgetCategoryDTO } from '../../services/budget.service';
// //
// // @Component({
// //   selector: 'app-budget-tracker',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, MatIconModule],
// //   templateUrl: './budget-tracker.html',
// //   styleUrls: ['./budget-tracker.scss']
// // })
// // export class BudgetTracker implements OnInit {
// //   // Backend budget data
// //   budgetData: BudgetDTO | null = null;
// //   budget = 0;
// //   totalSpent = 0;
// //   remaining = 0;
// //
// //   // Items (expenses)
// //   expenses: { id: number; name: string; amount: number; category: string }[] = [];
// //   newName = '';
// //   newAmount: number = 0;
// //   newCategory: string = '';
// //
// //   // Category limits and data
// //   categoryData: BudgetCategoryDTO[] = [];
// //   categoryLimits: { [key: string]: number } = {};
// //   private lastCategoryLimits: Record<string, number> = {};
// //
// //   constructor(private svc: BudgetService) {}
// //
// //   ngOnInit(): void {
// //     console.log('[BudgetTracker] init userId=', localStorage.getItem('user_id'));
// //     this.loadBudgetData();
// //   }
// //
// //   loadBudgetData(): void {
// //     console.log('[BudgetTracker] GET /api/budget');
// //     this.svc.getBudget().subscribe({
// //       next: (dto) => {
// //         console.log('[BudgetTracker] budgetDTO=', dto);
// //         this.budgetData = dto;
// //         this.budget = dto.totalBudget || 0;
// //         this.totalSpent = dto.totalSpent || 0;
// //         this.remaining = dto.remaining || 0;
// //         this.categoryData = dto.allCategoryDTOs || [];
// //         this.expenses = (dto.itemDTOs || []).map(it => ({
// //           id: it.id!,
// //           name: it.itemName,
// //           amount: it.amount,
// //           category: this.mapCategoryTypeToLabel(it.categoryType)
// //         }));
// //         this.initCategoryLimitsFromBackend();
// //         this.listExpenses(); // optional second log
// //       },
// //       error: (err) => {
// //         console.error('[BudgetService] GET /api/budget failed', err);
// //         alert('Failed to load expenses. Please try again');
// //       }
// //     });
// //   }
// //
// //   private initCategoryLimitsFromBackend(): void {
// //     this.categoryLimits = {};
// //     this.lastCategoryLimits = {};
// //     this.categoryData.forEach(c => {
// //       const ct = c.categoryType; // enum string (e.g., EVENT_PLANNING)
// //       const limit = c.limit ?? 0;
// //       // store by enum key for reliable updates
// //       this.categoryLimits[ct] = limit;
// //       this.lastCategoryLimits[ct] = limit;
// //     });
// //   }
// //
// //   listExpenses(): void {
// //     console.log('[BudgetTracker] list expenses=', this.expenses);
// //   }
// //
// //   updateBudgetInBackend(): void {
// //     if (!this.budgetData) return;
// //     const payload: Partial<BudgetDTO> = {
// //       id: this.budgetData.id ?? undefined,
// //       totalBudget: Number(this.budget) || 0
// //     };
// //     console.log('[BudgetTracker] debounced PUT /api/budget', payload);
// //     this.svc.updateBudget(payload).subscribe({
// //       next: (res) => {
// //         console.log('[BudgetTracker] auto PUT response', res);
// //         this.budgetData = res;
// //         this.budget = res.totalBudget;
// //         this.totalSpent = res.totalSpent;
// //         this.remaining = res.remaining;
// //         // refresh categories and items after update
// //         this.loadBudgetData();
// //       },
// //       error: (err) => {
// //         console.error('[BudgetService] PUT /api/budget failed', err);
// //         alert('Failed to update budget');
// //       }
// //     });
// //   }
// //
// //   addExpense(): void {
// //     if (!this.newName || !Number.isFinite(Number(this.newAmount)) || !this.newCategory) return;
// //     const dto: BudgetItemDTO = {
// //       itemName: this.newName,
// //       amount: Number(this.newAmount),
// //       categoryType: this.mapCategoryLabelToType(this.newCategory)
// //     };
// //     console.log('[BudgetTracker] POST /api/budget/items via svc.add payload=', {
// //       name: this.newName, amount: this.newAmount, category: this.newCategory
// //     });
// //     this.svc.addBudgetItem(dto).subscribe({
// //       next: (res) => {
// //         console.log('[BudgetTracker] add item success; refreshing');
// //         this.newName = '';
// //         this.newAmount = 0;
// //         this.newCategory = '';
// //         this.loadBudgetData();
// //       },
// //       error: (err) => {
// //         console.error('[BudgetService] POST /api/budget/items failed', err);
// //         alert('Failed to add item');
// //       }
// //     });
// //   }
// //
// //   editExpense(exp: { id: number; name: string; amount: number; category: string }): void {
// //     const dto: BudgetItemDTO = {
// //       id: exp.id,
// //       itemName: exp.name,
// //       amount: Number(exp.amount),
// //       categoryType: this.mapCategoryLabelToType(exp.category)
// //     };
// //     this.svc.updateBudgetItem(exp.id, dto).subscribe({
// //       next: () => this.loadBudgetData(),
// //       error: (err) => {
// //         console.error('[BudgetService] PUT /api/budget/items/{id} failed', err);
// //         alert('Failed to update item');
// //       }
// //     });
// //   }
// //
// //   deleteExpense(id: number): void {
// //     this.svc.deleteBudgetItem(id).subscribe({
// //       next: () => this.loadBudgetData(),
// //       error: (err) => {
// //         console.error('[BudgetService] DELETE /api/budget/items/{id} failed', err);
// //         alert('Failed to delete item');
// //       }
// //     });
// //   }
// //
// //   // Triggered on blur only; prevents sending null/empty
// //   onCategoryLimitInput(categoryType: string, raw: any): void {
// //     const val = typeof raw === 'number' ? raw : Number(raw);
// //     if (!Number.isFinite(val)) return; // ignore empty/invalid
// //     if (this.lastCategoryLimits[categoryType] === val) return; // no change
// //
// //     console.log('[BudgetTracker] PATCH /api/budget/categories limit payload=', { categoryType, value: val });
// //     this.svc.updateCategoryLimit(categoryType, val).subscribe({
// //       next: (res) => {
// //         if (res) {
// //           this.lastCategoryLimits[categoryType] = val;
// //           // refresh computed totals/percentages
// //           this.loadBudgetData();
// //         }
// //       },
// //       error: (err) => {
// //         console.error('[BudgetService] updateCategoryLimit failed', err);
// //         alert('Failed to update category limit. Please try again.');
// //       }
// //     });
// //   }
// //
// //   // Helpers to map label <-> enum
// //   private mapCategoryLabelToType(label: string): string {
// //     const normalized = label.trim().toLowerCase();
// //     if (normalized === 'event planning') return 'EVENT_PLANNING';
// //     if (normalized === 'photography') return 'PHOTOGRAPHY';
// //     if (normalized === 'catering') return 'CATERING';
// //     if (normalized === 'flowers') return 'FLOWERS';
// //     if (normalized === 'music') return 'MUSIC';
// //     if (normalized === 'venues' || normalized === 'venue') return 'VENUES';
// //     return 'EVENT_PLANNING';
// //   }
// //
// //   private mapCategoryTypeToLabel(enumVal: string): string {
// //     switch (enumVal) {
// //       case 'EVENT_PLANNING': return 'Event Planning';
// //       case 'PHOTOGRAPHY': return 'Photography';
// //       case 'CATERING': return 'Catering';
// //       case 'FLOWERS': return 'Flowers';
// //       case 'MUSIC': return 'Music';
// //       case 'VENUES': return 'Venues';
// //       default: return enumVal;
// //     }
// //   }
// // }
//
//



//6



// // frontend/Wedding-planner-frontend/src/app/pages/budget-tracker/budget-tracker.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon';
// import { BudgetService, BudgetDTO, BudgetItemDTO, BudgetCategoryDTO } from '../../services/budget.service';
// import { ReplacePipe } from '../../shared/replace.pipe';
//
// @Component({
//   selector: 'app-budget-tracker',
//   standalone: true,
//   imports: [CommonModule, FormsModule, MatIconModule, ReplacePipe],
//   templateUrl: './budget-tracker.html',
//   styleUrls: ['./budget-tracker.scss']
// })
// export class BudgetTracker implements OnInit {
//   budgetData: BudgetDTO | null = null;
//   budget = 0;
//   totalSpent = 0;
//   remaining = 0;
//
//   expenses: { id: number; name: string; amount: number; category: string }[] = [];
//   newName = '';
//   newAmount: number = 0;
//   newCategory: string = '';
//
//   categoryData: BudgetCategoryDTO[] = [];
//   categoryLimits: { [key: string]: number } = {};
//   private lastCategoryLimits: Record<string, number> = {};
//
//   constructor(private svc: BudgetService) {}
//
//   ngOnInit(): void {
//     console.log('[BudgetTracker] init userId=', localStorage.getItem('user_id'));
//     this.loadBudgetData();
//   }
//
//   loadBudgetData(): void {
//     console.log('[BudgetTracker] GET /api/budget');
//     this.svc.getBudget().subscribe({
//       next: (dto) => {
//         console.log('[BudgetTracker] budgetDTO=', dto);
//         this.budgetData = dto;
//         this.budget = dto.totalBudget || 0;
//         this.totalSpent = dto.totalSpent || 0;
//         this.remaining = dto.remaining || 0;
//         this.categoryData = dto.allCategoryDTOs || [];
//         this.expenses = (dto.itemDTOs || []).map(it => ({
//           id: it.id!,
//           name: it.itemName,
//           amount: it.amount,
//           category: this.mapCategoryTypeToLabel(it.categoryType)
//         }));
//         this.initCategoryLimitsFromBackend();
//         this.listExpenses();
//       },
//       error: (err) => {
//         console.error('[BudgetService] GET /api/budget failed', err);
//         alert('Failed to load expenses. Please try again');
//       }
//     });
//   }
//
//   private initCategoryLimitsFromBackend(): void {
//     this.categoryLimits = {};
//     this.lastCategoryLimits = {};
//     this.categoryData.forEach(c => {
//       const ct = c.categoryType;
//       const limit = c.limit ?? 0;
//       this.categoryLimits[ct] = limit;
//       this.lastCategoryLimits[ct] = limit;
//     });
//   }
//
//   listExpenses(): void {
//     console.log('[BudgetTracker] list expenses=', this.expenses);
//   }
//
//   updateBudgetInBackend(): void {
//     if (!this.budgetData) return;
//     const payload: Partial<BudgetDTO> = {
//       id: this.budgetData.id ?? undefined,
//       totalBudget: Number(this.budget) || 0
//     };
//     console.log('[BudgetTracker] debounced PUT /api/budget', payload);
//     this.svc.updateBudget(payload).subscribe({
//       next: (res) => {
//         console.log('[BudgetTracker] auto PUT response', res);
//         this.budgetData = res;
//         this.budget = res.totalBudget;
//         this.totalSpent = res.totalSpent;
//         this.remaining = res.remaining;
//         this.loadBudgetData();
//       },
//       error: (err) => {
//         console.error('[BudgetService] PUT /api/budget failed', err);
//         alert('Failed to update budget');
//       }
//     });
//   }
//
//   addExpense(): void {
//     if (!this.newName || !Number.isFinite(Number(this.newAmount)) || !this.newCategory) return;
//     const dto: BudgetItemDTO = {
//       itemName: this.newName,
//       amount: Number(this.newAmount),
//       categoryType: this.mapCategoryLabelToType(this.newCategory)
//     };
//     console.log('[BudgetTracker] POST /api/budget/items via svc.add payload=', {
//       name: this.newName, amount: this.newAmount, category: this.newCategory
//     });
//     this.svc.addBudgetItem(dto).subscribe({
//       next: () => {
//         console.log('[BudgetTracker] add item success; refreshing');
//         this.newName = '';
//         this.newAmount = 0;
//         this.newCategory = '';
//         this.loadBudgetData();
//       },
//       error: (err) => {
//         console.error('[BudgetService] POST /api/budget/items failed', err);
//         alert('Failed to add item');
//       }
//     });
//   }
//
//   editExpense(exp: { id: number; name: string; amount: number; category: string }): void {
//     const dto: BudgetItemDTO = {
//       id: exp.id,
//       itemName: exp.name,
//       amount: Number(exp.amount),
//       categoryType: this.mapCategoryLabelToType(exp.category)
//     };
//     this.svc.updateBudgetItem(exp.id, dto).subscribe({
//       next: () => this.loadBudgetData(),
//       error: (err) => {
//         console.error('[BudgetService] PUT /api/budget/items/{id} failed', err);
//         alert('Failed to update item');
//       }
//     });
//   }
//
//   deleteExpense(id: number): void {
//     this.svc.deleteBudgetItem(id).subscribe({
//       next: () => this.loadBudgetData(),
//       error: (err) => {
//         console.error('[BudgetService] DELETE /api/budget/items/{id} failed', err);
//         alert('Failed to delete item');
//       }
//     });
//   }
//
//   onCategoryLimitInput(categoryType: string, raw: any): void {
//     const val = typeof raw === 'number' ? raw : Number(raw);
//     if (!Number.isFinite(val)) return;
//     if (this.lastCategoryLimits[categoryType] === val) return;
//
//     console.log('[BudgetTracker] PATCH /api/budget/categories limit payload=', { categoryType, value: val });
//     this.svc.updateCategoryLimit(categoryType, val).subscribe({
//       next: (res) => {
//         if (res) {
//           this.lastCategoryLimits[categoryType] = val;
//           this.loadBudgetData();
//         }
//       },
//       error: (err) => {
//         console.error('[BudgetService] updateCategoryLimit failed', err);
//         alert('Failed to update category limit. Please try again.');
//       }
//     });
//   }
//
//   private mapCategoryLabelToType(label: string): string {
//     const normalized = label.trim().toLowerCase();
//     if (normalized === 'event planning') return 'EVENT_PLANNING';
//     if (normalized === 'photography') return 'PHOTOGRAPHY';
//     if (normalized === 'catering') return 'CATERING';
//     if (normalized === 'flowers') return 'FLOWERS';
//     if (normalized === 'music') return 'MUSIC';
//     if (normalized === 'venues' || normalized === 'venue') return 'VENUES';
//     return 'EVENT_PLANNING';
//   }
//
//   private mapCategoryTypeToLabel(enumVal: string): string {
//     switch (enumVal) {
//       case 'EVENT_PLANNING': return 'Event Planning';
//       case 'PHOTOGRAPHY': return 'Photography';
//       case 'CATERING': return 'Catering';
//       case 'FLOWERS': return 'Flowers';
//       case 'MUSIC': return 'Music';
//       case 'VENUES': return 'Venues';
//       default: return enumVal;
//     }
//   }
// }


//7


// frontend/Wedding-planner-frontend/src/app/pages/budget-tracker/budget-tracker.ts
// import { Component, OnInit } from '@angular/core';
// import { BudgetService, Expense, BudgetDTO, BudgetCategoryDTO } from '../../services/budget.service';
// import { VENDOR_CATEGORIES } from '../../services/vendor.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon';
//
// @Component({
//   selector: 'app-budget-tracker',
//   standalone: true,
//   imports: [CommonModule, FormsModule, MatIconModule],
//   templateUrl: './budget-tracker.html',
//   styleUrls: ['./budget-tracker.scss']
// })
// export class BudgetTracker implements OnInit {
//   expenses: Expense[] = [];
//   newName = '';
//   newAmount: number = 0;
//   newCategory: string = '';
//
//   categorySlices: { category: string; amount: number; color: string; percent: number }[] = [];
//   pieGradient = '';
//
//   editingId: number | null = null;
//   editDraft: Partial<Expense> = {};
//
//   // Backend budget data
//   budgetData: BudgetDTO | null = null;
//   budget: number = 0;
//   totalSpent: number = 0;
//   remaining: number = 0;
//   budgetKey = 'userBudget';
//
//   categoryLimits: { [category: string]: number } = {};
//   categoryLimitsKey = 'categoryLimits';
//   categoryData: BudgetCategoryDTO[] = [];
//
//   constructor(private svc: BudgetService) {}
//
//   ngOnInit() {
//     this.loadBudgetData();
//     this.loadCategoryLimits();
//     this.load();
//   }
//
//   loadBudgetData() {
//     this.svc.getBudget().subscribe({
//       next: (budgetDTO) => {
//         this.budgetData = budgetDTO;
//         this.budget = budgetDTO.totalBudget || 0;
//         this.totalSpent = budgetDTO.totalSpent || 0;
//         this.remaining = budgetDTO.remaining || 0;
//         this.categoryData = budgetDTO.allCategoryDTOs || [];
//
//         // Update category limits from backend data
//         this.categoryData.forEach(category => {
//           this.categoryLimits[this.mapCategoryTypeToString(category.categoryType)] = category.limit;
//         });
//
//         this.saveBudget();
//         this.saveCategoryLimits();
//       },
//       error: (error) => {
//         console.error('Error loading budget data:', error);
//         // Fallback to localStorage if backend fails
//         this.loadBudget();
//       }
//     });
//   }
//
//   loadBudget() {
//     const val = localStorage.getItem(this.budgetKey);
//     this.budget = val ? Number(val) : 0;
//   }
//
//   saveBudget() {
//     localStorage.setItem(this.budgetKey, String(this.budget));
//   }
//
//   updateBudgetInBackend() {
//     if (this.budgetData) {
//       const updatedBudget: BudgetDTO = {
//         ...this.budgetData,
//         totalBudget: this.budget
//       };
//
//       this.svc.updateBudget(updatedBudget).subscribe({
//         next: (budgetDTO) => {
//           this.budgetData = budgetDTO;
//           this.totalSpent = budgetDTO.totalSpent || 0;
//           this.remaining = budgetDTO.remaining || 0;
//         },
//         error: (error) => {
//           console.error('Error updating budget:', error);
//           alert('Failed to update budget. Please try again.');
//         }
//       });
//     }
//   }
//
//   loadCategoryLimits() {
//     const val = localStorage.getItem(this.categoryLimitsKey);
//     this.categoryLimits = val ? JSON.parse(val) : {};
//   }
//
//   saveCategoryLimits() {
//     localStorage.setItem(this.categoryLimitsKey, JSON.stringify(this.categoryLimits));
//   }
//
//   setCategoryLimit(category: string, value: any) {
//     // Guard against empty/invalid values so we don't send ?newLimit=null/undefined
//     const v = value === '' || value == null ? NaN : Number(value);
//     if (!Number.isFinite(v)) return;
//
//     this.categoryLimits[category] = v;
//     this.saveCategoryLimits();
//
//     // Update in backend
//     const categoryType = this.mapStringToCategoryType(category);
//     this.svc.updateCategoryLimit(categoryType, v).subscribe({
//       next: (updatedCategory) => {
//         console.log('Category limit updated:', updatedCategory);
//       },
//       error: (error) => {
//         console.error('Error updating category limit:', error);
//         alert('Failed to update category limit. Please try again.');
//       }
//     });
//   }
//
//   private mapCategoryTypeToString(categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES'): string {
//     switch (categoryType) {
//       case 'EVENT_PLANNING': return 'Event Planning';
//       case 'PHOTOGRAPHY': return 'Photography';
//       case 'CATERING': return 'Catering';
//       case 'FLOWERS': return 'Flowers';
//       case 'MUSIC': return 'Music';
//       case 'VENUES': return 'Venues';
//       default: return 'Other';
//     }
//   }
//
//   private mapStringToCategoryType(category: string): 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES' {
//     switch (category.toLowerCase()) {
//       case 'event planning': return 'EVENT_PLANNING';
//       case 'photography': return 'PHOTOGRAPHY';
//       case 'catering': return 'CATERING';
//       case 'flowers': return 'FLOWERS';
//       case 'music': return 'MUSIC';
//       case 'venues': return 'VENUES';
//       default: return 'EVENT_PLANNING';
//     }
//   }
//
//   getCategoryLimit(category: string): number {
//     return this.categoryLimits[category] || 0;
//   }
//
//   isCategoryOverLimit(category: string, amount: number): boolean {
//     const limit = this.getCategoryLimit(category);
//     return limit > 0 && amount > limit;
//   }
//
//   get overBudget(): boolean {
//     return this.totalSpent > this.budget && this.budget > 0;
//   }
//
//   get remainingBudget(): number {
//     return this.remaining;
//   }
//
//   load() {
//     this.svc.list().subscribe({
//       next: (expenses) => {
//         this.expenses = expenses;
//         this.recomputeChart();
//       },
//       error: (error) => {
//         console.error('Error loading expenses:', error);
//         alert('Failed to load expenses. Please try again.');
//       }
//     });
//   }
//
//   add() {
//     if (!this.newName.trim() || !this.newAmount) return;
//     this.svc.add({ name: this.newName, amount: this.newAmount, category: this.newCategory || undefined })
//       .subscribe({
//         next: () => {
//           this.newName = '';
//           this.newAmount = 0;
//           this.newCategory = '';
//           this.load();
//           this.loadBudgetData(); // Refresh budget data
//         },
//         error: (error) => {
//           console.error('Error adding expense:', error);
//           alert('Failed to add expense. Please try again.');
//         }
//       });
//   }
//
//   remove(id: number) {
//     this.svc.remove(id).subscribe({
//       next: () => {
//         this.load();
//         this.loadBudgetData(); // Refresh budget data
//       },
//       error: (error) => {
//         console.error('Error removing expense:', error);
//         alert('Failed to remove expense. Please try again.');
//       }
//     });
//   }
//
//   total() {
//     return this.expenses.reduce((sum, e) => sum + e.amount, 0);
//   }
//
//   private recomputeChart() {
//     const totals = new Map<string, number>();
//     for (const e of this.expenses) {
//       const key = e.category || 'Other';
//       totals.set(key, (totals.get(key) || 0) + (Number(e.amount) || 0));
//     }
//     const totalAmount = Array.from(totals.values()).reduce((a, b) => a + b, 0);
//     const palette = [
//       '#A1B49A', '#FDAFA0', '#D3D8D5', '#E7AC96', '#ECC7BA', '#e29578',
//       '#8FA287', '#FFD7CF', '#B2B8B5', '#7E8D75'
//     ];
//     const entries = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
//     this.categorySlices = entries.map(([category, amount], idx) => ({
//       category,
//       amount,
//       color: palette[idx % palette.length],
//       percent: totalAmount ? (amount / totalAmount) * 100 : 0
//     }));
//
//     let current = 0;
//     const segments: string[] = [];
//     for (const s of this.categorySlices) {
//       const start = current;
//       const end = current + s.percent;
//       segments.push(`${s.color} ${start}% ${end}%`);
//       current = end;
//     }
//     this.pieGradient = segments.length
//       ? `conic-gradient(${segments.join(',')})`
//       : 'conic-gradient(#e9ecef 0 100%)';
//   }
//
//   get categories() {
//     return VENDOR_CATEGORIES;
//   }
//
//   startEdit(expense: Expense) {
//     this.editingId = expense.id;
//     this.editDraft = { ...expense };
//   }
//
//   cancelEdit() {
//     this.editingId = null;
//     this.editDraft = {};
//   }
//
//   saveEdit() {
//     if (this.editingId == null) return;
//     const updated: Expense = {
//       id: this.editingId,
//       name: (this.editDraft.name || '').trim(),
//       amount: Number(this.editDraft.amount) || 0,
//       category: this.editDraft.category || undefined
//     };
//     if (!updated.name || !updated.amount) return;
//     this.svc.update(updated).subscribe({
//       next: () => {
//         this.cancelEdit();
//         this.load();
//         this.loadBudgetData(); // Refresh budget data
//       },
//       error: (error) => {
//         console.error('Error updating expense:', error);
//         alert('Failed to update expense. Please try again.');
//       }
//     });
//   }
// }

