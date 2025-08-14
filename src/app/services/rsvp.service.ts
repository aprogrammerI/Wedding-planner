import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Rsvp {
  id: number;
  guestId: number;
  accepted: boolean | null;
  guestsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  private rsvps: Rsvp[] = [
    { id: 1, guestId: 1, accepted: true, guestsCount: 2 },
    { id: 2, guestId: 2, accepted: false, guestsCount: 1 },
    { id: 3, guestId: 3, accepted: true, guestsCount: 3 },
    { id: 4, guestId: 4, accepted: null, guestsCount: 2 },
    { id: 5, guestId: 5, accepted: null, guestsCount: 1 }
  ];

  private nextId = 6;

  list(): Observable<Rsvp[]> {
    return of(this.rsvps).pipe(delay(100));
  }

  respond(rsvp: Rsvp): Observable<Rsvp> {
    const index = this.rsvps.findIndex(r => r.id === rsvp.id);
    if (index !== -1) {
      this.rsvps[index] = rsvp;
    }
    return of(rsvp).pipe(delay(100));
  }

  add(rsvp: Omit<Rsvp, 'id'>): Observable<Rsvp> {
    const newRsvp: Rsvp = {
      ...rsvp,
      id: this.nextId++
    };
    this.rsvps.push(newRsvp);
    return of(newRsvp).pipe(delay(100));
  }

  remove(id: number): Observable<void> {
    this.rsvps = this.rsvps.filter(r => r.id !== id);
    return of(void 0).pipe(delay(100));
  }
}
