
//1


// // import { Injectable } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { Observable, throwError } from 'rxjs';
// // import { map, catchError } from 'rxjs/operators';
// //
// // // Frontend interfaces (for component usage)
// // export interface Expense {
// //   id: number;
// //   name: string;
// //   amount: number;
// //   category?: string;
// // }
// //
// // // Backend DTO interfaces
// // export interface BudgetDTO {
// //   id: number;
// //   totalBudget: number;
// //   remaining: number;
// //   totalSpent: number;
// //   itemDTOs: BudgetItemDTO[];
// //   allCategoryDTOs: BudgetCategoryDTO[];
// // }
// //
// // export interface BudgetItemDTO {
// //   id: number;
// //   itemName: string;
// //   amount: number;
// //   categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES';
// // }
// //
// // export interface BudgetCategoryDTO {
// //   categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES';
// //   spent: number;
// //   limit: number;
// //   status: string;
// //   percentage: number;
// // }
// //
// // export interface BudgetItemCreateRequest {
// //   itemName: string;
// //   amount: number;
// //   categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES';
// // }
// //
// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class BudgetService {
// //   private readonly API_BASE_URL = 'http://localhost:8080/api/budget';
// //
// //   constructor(private http: HttpClient) {}
// //
// //   // Mapping methods between frontend and backend
// //   private mapBudgetItemDTOToExpense(dto: BudgetItemDTO): Expense {
// //     return {
// //       id: dto.id,
// //       name: dto.itemName,
// //       amount: dto.amount,
// //       category: this.mapCategoryTypeToString(dto.categoryType)
// //     };
// //   }
// //
// //   private mapExpenseToBudgetItemDTO(expense: Expense): BudgetItemDTO {
// //     return {
// //       id: expense.id,
// //       itemName: expense.name,
// //       amount: expense.amount,
// //       categoryType: this.mapStringToCategoryType(expense.category || 'OTHER')
// //     };
// //   }
// //
// //   private mapCategoryTypeToString(categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES'): string {
// //     switch (categoryType) {
// //       case 'EVENT_PLANNING': return 'Event Planning';
// //       case 'PHOTOGRAPHY': return 'Photography';
// //       case 'CATERING': return 'Catering';
// //       case 'FLOWERS': return 'Flowers';
// //       case 'MUSIC': return 'Music';
// //       case 'VENUES': return 'Venues';
// //       default: return 'Other';
// //     }
// //   }
// //
// //   private mapStringToCategoryType(category: string): 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES' {
// //     switch (category.toLowerCase()) {
// //       case 'event planning': return 'EVENT_PLANNING';
// //       case 'photography': return 'PHOTOGRAPHY';
// //       case 'catering': return 'CATERING';
// //       case 'flowers': return 'FLOWERS';
// //       case 'music': return 'MUSIC';
// //       case 'venues': return 'VENUES';
// //       default: return 'EVENT_PLANNING'; // Default fallback
// //     }
// //   }
// //
// //   list(): Observable<Expense[]> {
// //     return this.http.get<BudgetDTO>(this.API_BASE_URL).pipe(
// //       map(budgetDTO => budgetDTO.itemDTOs.map(dto => this.mapBudgetItemDTOToExpense(dto))),
// //       catchError(error => {
// //         console.error('Error fetching budget items:', error);
// //         return throwError(() => new Error('Failed to fetch budget items'));
// //       })
// //     );
// //   }
// //
// //   add(expense: Omit<Expense, 'id'>): Observable<Expense> {
// //     const createRequest: BudgetItemCreateRequest = {
// //       itemName: expense.name,
// //       amount: expense.amount,
// //       categoryType: this.mapStringToCategoryType(expense.category || 'OTHER')
// //     };
// //
// //     return this.http.post<BudgetItemDTO>(`${this.API_BASE_URL}/items`, createRequest).pipe(
// //       map(dto => this.mapBudgetItemDTOToExpense(dto)),
// //       catchError(error => {
// //         console.error('Error creating budget item:', error);
// //         return throwError(() => new Error('Failed to create budget item'));
// //       })
// //     );
// //   }
// //
// //   update(expense: Expense): Observable<Expense> {
// //     const budgetItemDTO = this.mapExpenseToBudgetItemDTO(expense);
// //     return this.http.put<BudgetItemDTO>(`${this.API_BASE_URL}/items/${expense.id}`, budgetItemDTO).pipe(
// //       map(dto => this.mapBudgetItemDTOToExpense(dto)),
// //       catchError(error => {
// //         console.error('Error updating budget item:', error);
// //         return throwError(() => new Error('Failed to update budget item'));
// //       })
// //     );
// //   }
// //
// //   remove(id: number): Observable<void> {
// //     return this.http.delete<void>(`${this.API_BASE_URL}/items/${id}`).pipe(
// //       catchError(error => {
// //         console.error('Error deleting budget item:', error);
// //         return throwError(() => new Error('Failed to delete budget item'));
// //       })
// //     );
// //   }
// //
// //   // New methods for budget management
// //   getBudget(): Observable<BudgetDTO> {
// //     return this.http.get<BudgetDTO>(this.API_BASE_URL).pipe(
// //       catchError(error => {
// //         console.error('Error fetching budget:', error);
// //         return throwError(() => new Error('Failed to fetch budget'));
// //       })
// //     );
// //   }
// //
// //   updateBudget(budgetDTO: BudgetDTO): Observable<BudgetDTO> {
// //     return this.http.put<BudgetDTO>(this.API_BASE_URL, budgetDTO).pipe(
// //       catchError(error => {
// //         console.error('Error updating budget:', error);
// //         return throwError(() => new Error('Failed to update budget'));
// //       })
// //     );
// //   }
// //
// //   updateCategoryLimit(categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES', newLimit: number): Observable<BudgetCategoryDTO> {
// //     return this.http.patch<BudgetCategoryDTO>(`${this.API_BASE_URL}/categories/${categoryType}/limit?newLimit=${newLimit}`, {}).pipe(
// //       catchError(error => {
// //         console.error('Error updating category limit:', error);
// //         return throwError(() => new Error('Failed to update category limit'));
// //       })
// //     );
// //   }
// // }
//
//


//2




// // import { Injectable } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { Observable, throwError } from 'rxjs';
// // import { map, catchError } from 'rxjs/operators';
// //
// // export interface Expense {
// //   id: number;
// //   name: string;
// //   amount: number;
// //   category?: string;
// // }
// //
// // export interface BudgetDTO {
// //   id: number;
// //   totalBudget: number;
// //   remaining: number;
// //   totalSpent: number;
// //   itemDTOs: BudgetItemDTO[];
// //   allCategoryDTOs: BudgetCategoryDTO[];
// // }
// //
// // export interface BudgetItemDTO {
// //   id: number;
// //   itemName: string;
// //   amount: number;
// //   categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES';
// // }
// //
// // export interface BudgetCategoryDTO {
// //   categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES';
// //   spent: number;
// //   limit: number;
// //   status: string;
// //   percentage: number;
// // }
// //
// // export interface BudgetItemCreateRequest {
// //   itemName: string;
// //   amount: number;
// //   categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES';
// // }
// //
// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class BudgetService {
// //   private readonly API_BASE_URL = 'http://localhost:8080/api/budget';
// //
// //   constructor(private http: HttpClient) {}
// //
// //   private mapBudgetItemDTOToExpense(dto: BudgetItemDTO): Expense {
// //     return {
// //       id: dto.id,
// //       name: dto.itemName,
// //       amount: dto.amount,
// //       category: this.mapCategoryTypeToString(dto.categoryType)
// //     };
// //   }
// //
// //   private mapExpenseToBudgetItemDTO(expense: Expense): BudgetItemDTO {
// //     return {
// //       id: expense.id,
// //       itemName: expense.name,
// //       amount: expense.amount,
// //       categoryType: this.mapStringToCategoryType(expense.category || 'OTHER')
// //     } as BudgetItemDTO;
// //   }
// //
// //   private mapCategoryTypeToString(categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES'): string {
// //     switch (categoryType) {
// //       case 'EVENT_PLANNING': return 'Event Planning';
// //       case 'PHOTOGRAPHY': return 'Photography';
// //       case 'CATERING': return 'Catering';
// //       case 'FLOWERS': return 'Flowers';
// //       case 'MUSIC': return 'Music';
// //       case 'VENUES': return 'Venues';
// //       default: return 'Other';
// //     }
// //   }
// //
// //   private mapStringToCategoryType(category: string): 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES' {
// //     switch (category.toLowerCase()) {
// //       case 'event planning': return 'EVENT_PLANNING';
// //       case 'photography': return 'PHOTOGRAPHY';
// //       case 'catering': return 'CATERING';
// //       case 'flowers': return 'FLOWERS';
// //       case 'music': return 'MUSIC';
// //       case 'venues': return 'VENUES';
// //       default: return 'EVENT_PLANNING';
// //     }
// //   }
// //
// //   list(): Observable<Expense[]> {
// //     console.log('[BudgetService] GET items via GET /api/budget');
// //     return this.http.get<BudgetDTO>(this.API_BASE_URL).pipe(
// //       map(budgetDTO => budgetDTO.itemDTOs.map(dto => this.mapBudgetItemDTOToExpense(dto))),
// //       catchError(error => {
// //         console.error('[BudgetService] list failed', error);
// //         return throwError(() => new Error('Failed to fetch budget items'));
// //       })
// //     );
// //   }
// //
// //   add(expense: Omit<Expense, 'id'>): Observable<Expense> {
// //     const createRequest: BudgetItemCreateRequest = {
// //       itemName: expense.name,
// //       amount: expense.amount,
// //       categoryType: this.mapStringToCategoryType(expense.category || 'OTHER')
// //     };
// //     console.log('[BudgetService] POST /api/budget/items', createRequest);
// //     return this.http.post<BudgetItemDTO>(`${this.API_BASE_URL}/items`, createRequest).pipe(
// //       map(dto => this.mapBudgetItemDTOToExpense(dto)),
// //       catchError(error => {
// //         console.error('[BudgetService] add failed', error);
// //         return throwError(() => new Error('Failed to create budget item'));
// //       })
// //     );
// //   }
// //
// //   update(expense: Expense): Observable<Expense> {
// //     const budgetItemDTO = this.mapExpenseToBudgetItemDTO(expense);
// //     console.log('[BudgetService] PUT /api/budget/items/' + expense.id, budgetItemDTO);
// //     return this.http.put<BudgetItemDTO>(`${this.API_BASE_URL}/items/${expense.id}`, budgetItemDTO).pipe(
// //       map(dto => this.mapBudgetItemDTOToExpense(dto)),
// //       catchError(error => {
// //         console.error('[BudgetService] update failed', error);
// //         return throwError(() => new Error('Failed to update budget item'));
// //       })
// //     );
// //   }
// //
// //   remove(id: number): Observable<void> {
// //     console.log('[BudgetService] DELETE /api/budget/items/' + id);
// //     return this.http.delete<void>(`${this.API_BASE_URL}/items/${id}`).pipe(
// //       catchError(error => {
// //         console.error('[BudgetService] remove failed', error);
// //         return throwError(() => new Error('Failed to delete budget item'));
// //       })
// //     );
// //   }
// //
// //   // New methods for budget management
// //   getBudget(): Observable<BudgetDTO> {
// //     console.log('[BudgetService] GET /api/budget');
// //     return this.http.get<BudgetDTO>(this.API_BASE_URL).pipe(
// //       catchError(error => {
// //         console.error('[BudgetService] getBudget failed', error);
// //         return throwError(() => new Error('Failed to fetch budget'));
// //       })
// //     );
// //   }
// //
// //   updateBudget(budgetDTO: BudgetDTO): Observable<BudgetDTO> {
// //     console.log('[BudgetService] PUT /api/budget', budgetDTO);
// //     return this.http.put<BudgetDTO>(this.API_BASE_URL, budgetDTO).pipe(
// //       catchError(error => {
// //         console.error('[BudgetService] updateBudget failed', error);
// //         return throwError(() => new Error('Failed to update budget'));
// //       })
// //     );
// //   }
// //
// //   updateCategoryLimit(categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES', newLimit: number): Observable<BudgetCategoryDTO> {
// //     console.log('[BudgetService] PATCH /api/budget/categories/' + categoryType + '/limit?newLimit=' + newLimit);
// //     return this.http.patch<BudgetCategoryDTO>(`${this.API_BASE_URL}/categories/${categoryType}/limit?newLimit=${newLimit}`, {}).pipe(
// //       catchError(error => {
// //         console.error('[BudgetService] updateCategoryLimit failed', error);
// //         return throwError(() => new Error('Failed to update category limit'));
// //       })
// //     );
// //   }
// // }
//
//




//3




// // frontend/Wedding-planner-frontend/src/app/services/budget.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
//
// export interface BudgetItemDTO {
//   id?: number;
//   itemName: string;
//   amount: number;
//   categoryType: string; // EVENT_PLANNING | PHOTOGRAPHY | CATERING | FLOWERS | MUSIC | VENUES
// }
//
// export interface BudgetCategoryDTO {
//   categoryType: string;
//   spent: number;
//   limit: number;
//   status: string;
//   percentage: number;
// }
//
// export interface BudgetDTO {
//   id?: number | null;
//   totalBudget: number;
//   remaining: number;
//   totalSpent: number;
//   itemDTOs: BudgetItemDTO[];
//   allCategoryDTOs: BudgetCategoryDTO[];
// }
//
// @Injectable({
//   providedIn: 'root'
// })
// export class BudgetService {
//   private readonly API_BASE_URL = 'http://localhost:8080/api';
//
//   constructor(private http: HttpClient) {}
//
//   getBudget(): Observable<BudgetDTO> {
//     return this.http.get<BudgetDTO>(`${this.API_BASE_URL}/budget`);
//   }
//
//   updateBudget(dto: Partial<BudgetDTO>): Observable<BudgetDTO> {
//     return this.http.put<BudgetDTO>(`${this.API_BASE_URL}/budget`, dto);
//   }
//
//   addBudgetItem(dto: BudgetItemDTO): Observable<BudgetItemDTO> {
//     return this.http.post<BudgetItemDTO>(`${this.API_BASE_URL}/budget/items`, dto);
//   }
//
//   updateBudgetItem(id: number, dto: BudgetItemDTO): Observable<BudgetItemDTO> {
//     return this.http.put<BudgetItemDTO>(`${this.API_BASE_URL}/budget/items/${id}`, dto);
//   }
//
//   deleteBudgetItem(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.API_BASE_URL}/budget/items/${id}`);
//   }
//
//   // Guard against empty/invalid values so we never send ...?newLimit=null
//   updateCategoryLimit(categoryType: string, newLimit: number | null | undefined): Observable<BudgetCategoryDTO | null> {
//     const numeric = typeof newLimit === 'number' ? newLimit : Number(newLimit);
//     if (!Number.isFinite(numeric)) {
//       return of(null);
//     }
//     const params = new HttpParams().set('newLimit', String(numeric));
//     return this.http.patch<BudgetCategoryDTO>(
//       `${this.API_BASE_URL}/budget/categories/${categoryType}/limit`,
//       null,
//       { params }
//     );
//   }
// }
//


//4





// frontend/Wedding-planner-frontend/src/app/services/budget.service.ts
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

  // updateCategoryLimit(categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES', newLimit: number): Observable<BudgetCategoryDTO> {
  //   // Build query via HttpParams to avoid sending "null"/"undefined"
  //   const params = new HttpParams().set('newLimit', String(newLimit));
  //   return this.http.patch<BudgetCategoryDTO>(`${this.API_BASE_URL}/categories/${categoryType}/limit`, null, { params }).pipe(
  //     catchError(error => {
  //       console.error('Error updating category limit:', error);
  //       return throwError(() => new Error('Failed to update category limit'));
  //     })
  //   );
  // }


  // updateCategoryLimit(
  //   categoryType: 'EVENT_PLANNING' | 'PHOTOGRAPHY' | 'CATERING' | 'FLOWERS' | 'MUSIC' | 'VENUES',
  //   newLimit: number
  // ) {
  //   const params = new HttpParams().set('newLimit', String(newLimit));
  //   console.log('[BudgetService] PATCH /api/budget/categories/' + categoryType + '/limit', { newLimit });
  //   return this.http.patch<BudgetCategoryDTO>(
  //     `${this.API_BASE_URL}/categories/${categoryType}/limit`,
  //     null,
  //     { params }
  //   );
  // }

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
