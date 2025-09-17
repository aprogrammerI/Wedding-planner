
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


// Frontend interfaces (for component usage)
export interface Expense {
  id: number;
  name: string;
  amount: number;
  category?: string;
}

// Backend DTO interfaces
export interface BudgetDTO {
  id: number;
  totalBudget: number;
  remaining: number;
  totalSpent: number;
  itemDTOs: BudgetItemDTO[];
  allCategoryDTOs: BudgetCategoryDTO[];
}

export interface BudgetItemDTO {
  id: number;
  itemName: string;
  amount: number;
  categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES';
}

export interface BudgetCategoryDTO {
  categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES';
  spent: number;
  limit: number;
  status: string;
  percentage: number;
}

export interface BudgetItemCreateRequest {
  itemName: string;
  amount: number;
  categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES';
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly API_BASE_URL = 'http://localhost:8080/api/budget';

  constructor(private http: HttpClient) {}

  // Mapping methods between frontend and backend
  private mapBudgetItemDTOToExpense(dto: BudgetItemDTO): Expense {
    return {
      id: dto.id,
      name: dto.itemName,
      amount: dto.amount,
      category: this.mapCategoryTypeToString(dto.categoryType)
    };
  }

  private mapExpenseToBudgetItemDTO(expense: Expense): BudgetItemDTO {
    return {
      id: expense.id,
      itemName: expense.name,
      amount: expense.amount,
      categoryType: this.mapStringToCategoryType(expense.category || 'OTHER')
    };
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
      default: return 'EVENT_PLANNING'; // Default fallback
    }
  }

  list(): Observable<Expense[]> {
    return this.http.get<BudgetDTO>(this.API_BASE_URL).pipe(
      map(budgetDTO => budgetDTO.itemDTOs.map(dto => this.mapBudgetItemDTOToExpense(dto))),
      catchError(error => {
        console.error('Error fetching budget items:', error);
        return throwError(() => new Error('Failed to fetch budget items'));
      })
    );
  }

  add(expense: Omit<Expense, 'id'>): Observable<Expense> {
    const createRequest: BudgetItemCreateRequest = {
      itemName: expense.name,
      amount: expense.amount,
      categoryType: this.mapStringToCategoryType(expense.category || 'OTHER')
    };

    return this.http.post<BudgetItemDTO>(`${this.API_BASE_URL}/items`, createRequest).pipe(
      map(dto => this.mapBudgetItemDTOToExpense(dto)),
      catchError(error => {
        console.error('Error creating budget item:', error);
        return throwError(() => new Error('Failed to create budget item'));
      })
    );
  }

  update(expense: Expense): Observable<Expense> {
    const budgetItemDTO = this.mapExpenseToBudgetItemDTO(expense);
    return this.http.put<BudgetItemDTO>(`${this.API_BASE_URL}/items/${expense.id}`, budgetItemDTO).pipe(
      map(dto => this.mapBudgetItemDTOToExpense(dto)),
      catchError(error => {
        console.error('Error updating budget item:', error);
        return throwError(() => new Error('Failed to update budget item'));
      })
    );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/items/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting budget item:', error);
        return throwError(() => new Error('Failed to delete budget item'));
      })
    );
  }

  // New methods for budget management
  getBudget(): Observable<BudgetDTO> {
    return this.http.get<BudgetDTO>(this.API_BASE_URL).pipe(
      catchError(error => {
        console.error('Error fetching budget:', error);
        return throwError(() => new Error('Failed to fetch budget'));
      })
    );
  }

  updateBudget(budgetDTO: BudgetDTO): Observable<BudgetDTO> {
    return this.http.put<BudgetDTO>(this.API_BASE_URL, budgetDTO).pipe(
      catchError(error => {
        console.error('Error updating budget:', error);
        return throwError(() => new Error('Failed to update budget'));
      })
    );
  }


  updateCategoryLimit(
    categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES',
    newLimit: number
  ) {
    const params = new HttpParams().set('newLimit', String(newLimit));
    console.log('[BudgetService] PATCH /api/budget/categories/' + categoryType + '/limit', { newLimit });
    return this.http.patch<BudgetCategoryDTO>(
      `${this.API_BASE_URL}/categories/${categoryType}/limit`,
      null,
      { params }
    );
  }

}
