import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Guest {
  id: number;
  name: string;
  status: 'pending' | 'accepted' | 'declined';
  side: 'bride' | 'groom';
  tableNumber?: number;
  mealPlan?: string;
  comments?: string;
  rsvpDropdownOpen?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private guests: Guest[] = [
    { id: 1, name: 'John Doe', status: 'accepted', side: 'bride', tableNumber: 1, mealPlan: 'Chicken', comments: 'No onions' },
    { id: 2, name: 'Jane Smith', status: 'pending', side: 'bride', tableNumber: 2, mealPlan: 'Vegetarian', comments: '' },
    { id: 3, name: 'Mike Johnson', status: 'declined', side: 'groom', tableNumber: 3, mealPlan: 'Beef', comments: 'Allergic to nuts' },
    { id: 4, name: 'Sarah Wilson', status: 'accepted', side: 'groom', tableNumber: 1, mealPlan: 'Fish', comments: '' },
    { id: 5, name: 'David Brown', status: 'pending', side: 'bride', tableNumber: 2, mealPlan: '', comments: '' }
  ];

  private nextId = 6;

  list(): Observable<Guest[]> {
    return of(this.guests).pipe(delay(100));
  }

  add(guest: Omit<Guest, 'id'>): Observable<Guest> {
    const newGuest: Guest = {
      ...guest,
      id: this.nextId++
    };
    this.guests.push(newGuest);
    return of(newGuest).pipe(delay(100));
  }

  update(guest: Guest): Observable<Guest> {
    const index = this.guests.findIndex(g => g.id === guest.id);
    if (index !== -1) {
      this.guests[index] = guest;
    }
    return of(guest).pipe(delay(100));
  }

  remove(id: number): Observable<void> {
    this.guests = this.guests.filter(g => g.id !== id);
    return of(void 0).pipe(delay(100));
  }
}
