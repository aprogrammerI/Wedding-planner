import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StoredWeddingDetails {
  brideFirstName: string;
  brideLastName: string;
  groomFirstName: string;
  groomLastName: string;
  bestMen: { firstName: string; lastName: string }[];
  bestWomen: { firstName: string; lastName: string }[];
  brideGuests: string[];
  groomGuests: string[];
  events?: ItineraryEvent[];
}

interface ItineraryEvent {
  id: number;
  date: string;   // YYYY-MM-DD
  start: string;  // HH:mm
  end?: string;   // HH:mm
  title: string;
}

@Component({
  selector: 'app-wedding-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wedding-details.html',
  styleUrls: ['./wedding-details.scss']
})
export class WeddingDetails implements OnInit {
  // Couple details
  brideFirstName = '';
  brideLastName = '';
  groomFirstName = '';
  groomLastName = '';

  // Wedding party
  bestMen: { firstName: string; lastName: string }[] = [];
  bestWomen: { firstName: string; lastName: string }[] = [];
  newBestManFirstName = '';
  newBestManLastName = '';
  newBestWomanFirstName = '';
  newBestWomanLastName = '';

  // Guests
  brideGuests: string[] = [];
  groomGuests: string[] = [];
  newBrideGuest = '';
  newGroomGuest = '';

  private storageKey = 'weddingDetails';
  // Budget
  budgetKey = 'userBudget';
  totalBudget: number = 0;
  newBudgetValue: number | null = null;
  adjustBudgetAmount: number | null = null;

  // Itinerary
  events: ItineraryEvent[] = [];
  newEventDate: string = '';
  newEventStart: string = '';
  newEventEnd: string = '';
  newEventTitle: string = '';
  private nextEventId: number = 1;

  ngOnInit(): void {
    this.load();
    this.loadBudget();
  }

  addBrideGuest(): void {
    const value = (this.newBrideGuest || '').trim();
    if (!value) return;
    this.brideGuests = [...this.brideGuests, value];
    this.newBrideGuest = '';
    this.save();
  }

  removeBrideGuest(index: number): void {
    this.brideGuests = this.brideGuests.filter((_, i) => i !== index);
    this.save();
  }

  addGroomGuest(): void {
    const value = (this.newGroomGuest || '').trim();
    if (!value) return;
    this.groomGuests = [...this.groomGuests, value];
    this.newGroomGuest = '';
    this.save();
  }

  removeGroomGuest(index: number): void {
    this.groomGuests = this.groomGuests.filter((_, i) => i !== index);
    this.save();
  }

  addBestMan(): void {
    const first = (this.newBestManFirstName || '').trim();
    const last = (this.newBestManLastName || '').trim();
    if (!first && !last) return;
    this.bestMen = [...this.bestMen, { firstName: first, lastName: last }];
    this.newBestManFirstName = '';
    this.newBestManLastName = '';
    this.save();
  }

  removeBestMan(index: number): void {
    this.bestMen = this.bestMen.filter((_, i) => i !== index);
    this.save();
  }

  addBestWoman(): void {
    const first = (this.newBestWomanFirstName || '').trim();
    const last = (this.newBestWomanLastName || '').trim();
    if (!first && !last) return;
    this.bestWomen = [...this.bestWomen, { firstName: first, lastName: last }];
    this.newBestWomanFirstName = '';
    this.newBestWomanLastName = '';
    this.save();
  }

  removeBestWoman(index: number): void {
    this.bestWomen = this.bestWomen.filter((_, i) => i !== index);
    this.save();
  }

  save(): void {
    const payload: StoredWeddingDetails = {
      brideFirstName: (this.brideFirstName || '').trim(),
      brideLastName: (this.brideLastName || '').trim(),
      groomFirstName: (this.groomFirstName || '').trim(),
      groomLastName: (this.groomLastName || '').trim(),
      bestMen: this.bestMen,
      bestWomen: this.bestWomen,
      brideGuests: this.brideGuests,
      groomGuests: this.groomGuests,
      events: this.events
    };
    localStorage.setItem(this.storageKey, JSON.stringify(payload));
  }

  clearAll(): void {
    localStorage.removeItem(this.storageKey);
    this.brideFirstName = '';
    this.brideLastName = '';
    this.groomFirstName = '';
    this.groomLastName = '';
    this.bestMen = [];
    this.bestWomen = [];
    this.brideGuests = [];
    this.groomGuests = [];
    this.newBrideGuest = '';
    this.newGroomGuest = '';
    this.newBestManFirstName = '';
    this.newBestManLastName = '';
    this.newBestWomanFirstName = '';
    this.newBestWomanLastName = '';
  }

  private load(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;
    try {
      const parsed: any = JSON.parse(raw);
      this.brideFirstName = parsed.brideFirstName || '';
      this.brideLastName = parsed.brideLastName || '';
      this.groomFirstName = parsed.groomFirstName || '';
      this.groomLastName = parsed.groomLastName || '';
      // Backward compatibility: migrate single fields to arrays if present
      if (Array.isArray(parsed.bestMen)) {
        this.bestMen = parsed.bestMen;
      } else if (parsed.bestManFirstName || parsed.bestManLastName) {
        this.bestMen = [{ firstName: parsed.bestManFirstName || '', lastName: parsed.bestManLastName || '' }];
      } else {
        this.bestMen = [];
      }
      if (Array.isArray(parsed.bestWomen)) {
        this.bestWomen = parsed.bestWomen;
      } else if (parsed.bestWomanFirstName || parsed.bestWomanLastName) {
        this.bestWomen = [{ firstName: parsed.bestWomanFirstName || '', lastName: parsed.bestWomanLastName || '' }];
      } else {
        this.bestWomen = [];
      }
      this.brideGuests = Array.isArray(parsed.brideGuests) ? parsed.brideGuests : [];
      this.groomGuests = Array.isArray(parsed.groomGuests) ? parsed.groomGuests : [];
      this.events = Array.isArray(parsed.events) ? parsed.events : [];
      this.nextEventId = (this.events.reduce((m: number, e: ItineraryEvent) => Math.max(m, e.id), 0) || 0) + 1;
    } catch {
      // ignore malformed storage
    }
  }

  // Budget handlers
  private loadBudget(): void {
    const val = localStorage.getItem(this.budgetKey);
    this.totalBudget = val ? Number(val) : 0;
  }

  setBudget(): void {
    if (this.newBudgetValue == null || isNaN(this.newBudgetValue as any)) return;
    const value = Math.max(0, Number(this.newBudgetValue));
    this.totalBudget = value;
    this.saveBudget();
    this.newBudgetValue = null;
  }

  addBudget(): void {
    if (this.adjustBudgetAmount == null || isNaN(this.adjustBudgetAmount as any)) return;
    const amt = Math.max(0, Number(this.adjustBudgetAmount));
    this.totalBudget = this.totalBudget + amt;
    this.saveBudget();
    this.adjustBudgetAmount = null;
  }

  removeBudget(): void {
    if (this.adjustBudgetAmount == null || isNaN(this.adjustBudgetAmount as any)) return;
    const amt = Math.max(0, Number(this.adjustBudgetAmount));
    this.totalBudget = Math.max(0, this.totalBudget - amt);
    this.saveBudget();
    this.adjustBudgetAmount = null;
  }

  private saveBudget(): void {
    localStorage.setItem(this.budgetKey, String(this.totalBudget));
  }

  // Itinerary handlers
  get sortedEvents(): ItineraryEvent[] {
    return [...this.events].sort((a, b) => {
      const aKey = `${a.date} ${a.start}`;
      const bKey = `${b.date} ${b.start}`;
      return aKey.localeCompare(bKey);
    });
  }

  addEvent(): void {
    const date = (this.newEventDate || '').trim();
    const start = (this.newEventStart || '').trim();
    const title = (this.newEventTitle || '').trim();
    if (!date || !start || !title) return;
    const startMin = this.toMinutes(start);
    const endStr = (this.newEventEnd || '').trim();
    const endMin = endStr ? this.toMinutes(endStr) : startMin;
    if (endMin < startMin) {
      alert('End time must be after start time.');
      return;
    }
    const overlaps = this.events.some(e => e.date === date && this.isOverlap(startMin, endMin, this.toMinutes(e.start), this.toMinutes(e.end || e.start)));
    if (overlaps) {
      alert('This event overlaps with an existing one. Please adjust the time.');
      return;
    }
    const evt: ItineraryEvent = {
      id: this.nextEventId++,
      date,
      start,
      end: endStr || undefined,
      title
    };
    this.events = [...this.events, evt];
    this.newEventDate = '';
    this.newEventStart = '';
    this.newEventEnd = '';
    this.newEventTitle = '';
    this.save();
  }

  removeEvent(id: number): void {
    this.events = this.events.filter(e => e.id !== id);
    this.save();
  }

  private toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(n => Number(n));
    return h * 60 + (m || 0);
  }

  private isOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
    return aStart < bEnd && aEnd > bStart;
  }
}

