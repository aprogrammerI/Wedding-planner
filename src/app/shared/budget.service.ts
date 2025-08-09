import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Expense {
  id: number;
  name: string;
  amount: number;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private expenses: Expense[] = [
    { id: 1, name: 'Grand Venues', amount: 2000, category: 'Venues' },
    { id: 2, name: 'Dinner Package', amount: 1500, category: 'Catering' },
    { id: 3, name: 'Bliss Photography', amount: 500, category: 'Photography' },
    { id: 4, name: 'Floral Fantasy', amount: 300, category: 'Flowers' },
    { id: 5, name: 'Decor & Lighting', amount: 700, category: 'Event Planning' },
    { id: 6, name: 'Live Band', amount: 1000, category: 'Music' }
  ];

  private nextId = 7;

  list(): Observable<Expense[]> {
    return of(this.expenses).pipe(delay(100));
  }

  add(expense: Omit<Expense, 'id'>): Observable<Expense> {
    const newExpense: Expense = {
      ...expense,
      id: this.nextId++
    };
    this.expenses.push(newExpense);
    return of(newExpense).pipe(delay(100));
  }

  update(expense: Expense): Observable<Expense> {
    const idx = this.expenses.findIndex(e => e.id === expense.id);
    if (idx !== -1) {
      this.expenses[idx] = expense;
    }
    return of(expense).pipe(delay(100));
  }

  remove(id: number): Observable<void> {
    this.expenses = this.expenses.filter(e => e.id !== id);
    return of(void 0).pipe(delay(100));
  }
}
