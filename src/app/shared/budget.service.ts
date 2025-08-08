import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Expense {
  id: number;
  name: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private expenses: Expense[] = [
    { id: 1, name: 'Venue', amount: 2000 },
    { id: 2, name: 'Catering', amount: 1500 },
    { id: 3, name: 'Photography', amount: 500 },
    { id: 4, name: 'Flowers', amount: 300 },
    { id: 5, name: 'Decorations', amount: 700 },
    { id: 6, name: 'Music', amount: 1000 }
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

  remove(id: number): Observable<void> {
    this.expenses = this.expenses.filter(e => e.id !== id);
    return of(void 0).pipe(delay(100));
  }
}
