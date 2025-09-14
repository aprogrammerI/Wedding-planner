import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Frontend interfaces (for component usage)
export interface Guest {
  id: number;
  name: string;
  status: 'pending' | 'accepted' | 'declined';
  side: 'bride' | 'groom';
  role?: 'bridesmaid' | 'best man' | 'parent' | 'relative' | 'friend' | 'guest';
  tableNumber?: number;
  mealPlan?: string;
  comments?: string;
  rsvpDropdownOpen?: boolean;
}

// Backend DTO interfaces
export interface GuestDto {
  id: number;
  name: string;
  rsvpStatus?: 'ACCEPTED' | 'PENDING' | 'DECLINED';
  side?: 'BRIDE' | 'GROOM';
  role?: 'BRIDESMAID' | 'BEST_MAN' | 'PARENT' | 'RELATIVE' | 'FRIEND' | 'GUEST';
  tableNumber?: number;
  mealPlan?: string;
  comments?: string;
}

export interface GuestCreateRequest {
  name: string;
  side?: 'BRIDE' | 'GROOM';
  role?: 'BRIDESMAID' | 'BEST_MAN' | 'PARENT' | 'RELATIVE' | 'FRIEND' | 'GUEST';
}

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private readonly API_BASE_URL = 'http://localhost:8080/api/guests';

  constructor(private http: HttpClient) {}

  // Mapping methods between frontend and backend
  private mapGuestDtoToGuest(dto: GuestDto): Guest {
    return {
      id: dto.id,
      name: dto.name,
      status: this.mapRsvpStatusToString(dto.rsvpStatus || 'PENDING'),
      side: this.mapGuestSideToString(dto.side || 'BRIDE'),
      role: dto.role ? this.mapGuestRoleToString(dto.role) : undefined,
      tableNumber: dto.tableNumber,
      mealPlan: dto.mealPlan,
      comments: dto.comments
    };
  }

  private mapGuestToGuestDto(guest: Guest): GuestDto {
    return {
      id: guest.id,
      name: guest.name,
      rsvpStatus: this.mapStringToRsvpStatus(guest.status),
      side: this.mapStringToGuestSide(guest.side),
      role: guest.role ? this.mapStringToGuestRole(guest.role) : undefined,
      tableNumber: guest.tableNumber,
      mealPlan: guest.mealPlan,
      comments: guest.comments
    };
  }

  private mapRsvpStatusToString(status: 'ACCEPTED' | 'PENDING' | 'DECLINED'): 'pending' | 'accepted' | 'declined' {
    switch (status) {
      case 'ACCEPTED': return 'accepted';
      case 'PENDING': return 'pending';
      case 'DECLINED': return 'declined';
      default: return 'pending';
    }
  }

  private mapStringToRsvpStatus(status: 'pending' | 'accepted' | 'declined'): 'ACCEPTED' | 'PENDING' | 'DECLINED' {
    switch (status) {
      case 'accepted': return 'ACCEPTED';
      case 'pending': return 'PENDING';
      case 'declined': return 'DECLINED';
      default: return 'PENDING';
    }
  }

  private mapGuestSideToString(side: 'BRIDE' | 'GROOM'): 'bride' | 'groom' {
    switch (side) {
      case 'BRIDE': return 'bride';
      case 'GROOM': return 'groom';
      default: return 'bride';
    }
  }

  private mapStringToGuestSide(side: 'bride' | 'groom'): 'BRIDE' | 'GROOM' {
    switch (side) {
      case 'bride': return 'BRIDE';
      case 'groom': return 'GROOM';
      default: return 'BRIDE';
    }
  }

  private mapGuestRoleToString(role: 'BRIDESMAID' | 'BEST_MAN' | 'PARENT' | 'RELATIVE' | 'FRIEND' | 'GUEST'): 'bridesmaid' | 'best man' | 'parent' | 'relative' | 'friend' | 'guest' {
    switch (role) {
      case 'BRIDESMAID': return 'bridesmaid';
      case 'BEST_MAN': return 'best man';
      case 'PARENT': return 'parent';
      case 'RELATIVE': return 'relative';
      case 'FRIEND': return 'friend';
      case 'GUEST': return 'guest';
      default: return 'guest';
    }
  }

  private mapStringToGuestRole(role: 'bridesmaid' | 'best man' | 'parent' | 'relative' | 'friend' | 'guest'): 'BRIDESMAID' | 'BEST_MAN' | 'PARENT' | 'RELATIVE' | 'FRIEND' | 'GUEST' {
    switch (role) {
      case 'bridesmaid': return 'BRIDESMAID';
      case 'best man': return 'BEST_MAN';
      case 'parent': return 'PARENT';
      case 'relative': return 'RELATIVE';
      case 'friend': return 'FRIEND';
      case 'guest': return 'GUEST';
      default: return 'GUEST';
    }
  }

  list(groupBy?: string, sortBy?: string, sortOrder: string = 'ASC'): Observable<Guest[]> {
    let params = new HttpParams();
    if (groupBy) params = params.set('groupBy', groupBy);
    if (sortBy) params = params.set('sortBy', sortBy);
    if (sortOrder) params = params.set('sortOrder', sortOrder);

    return this.http.get<GuestDto[]>(this.API_BASE_URL, { params }).pipe(
      map(dtos => dtos.map(dto => this.mapGuestDtoToGuest(dto))),
      catchError(error => {
        console.error('Error fetching guests:', error);
        return throwError(() => new Error('Failed to fetch guests'));
      })
    );
  }

  add(guest: Omit<Guest, 'id'>): Observable<Guest> {
    const createRequest: GuestCreateRequest = {
      name: guest.name,
      side: this.mapStringToGuestSide(guest.side),
      role: guest.role ? this.mapStringToGuestRole(guest.role) : undefined
    };

    return this.http.post<GuestDto>(this.API_BASE_URL, createRequest).pipe(
      map(dto => this.mapGuestDtoToGuest(dto)),
      catchError(error => {
        console.error('Error creating guest:', error);
        return throwError(() => new Error('Failed to create guest'));
      })
    );
  }

  update(guest: Guest): Observable<Guest> {
    const guestDto = this.mapGuestToGuestDto(guest);
    return this.http.put<GuestDto>(`${this.API_BASE_URL}/${guest.id}`, guestDto).pipe(
      map(dto => this.mapGuestDtoToGuest(dto)),
      catchError(error => {
        console.error('Error updating guest:', error);
        return throwError(() => new Error('Failed to update guest'));
      })
    );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting guest:', error);
        return throwError(() => new Error('Failed to delete guest'));
      })
    );
  }

  getById(id: number): Observable<Guest> {
    return this.http.get<GuestDto>(`${this.API_BASE_URL}/${id}`).pipe(
      map(dto => this.mapGuestDtoToGuest(dto)),
      catchError(error => {
        console.error('Error fetching guest:', error);
        return throwError(() => new Error('Failed to fetch guest'));
      })
    );
  }
}
