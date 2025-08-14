import { Component, OnInit } from '@angular/core';
import { GuestService, Guest } from '../../services/guest.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './guest-list.html',
  styleUrls: ['./guest-list.scss']
})
export class GuestList implements OnInit {
  guests: Guest[] = [];
  newBrideName = '';
  newGroomName = '';
  viewMode: 'add' | 'details' = 'add';
  editingGuestId: number | null = null;
  editDraft: Partial<Guest> = {};
  rsvpIconFilter = 'invert(77%) sepia(13%) saturate(1162%) hue-rotate(314deg) brightness(101%) contrast(92%)'; // #F9AFA0

  constructor(private svc: GuestService) {}

  ngOnInit() { 
    this.load(); 
    document.addEventListener('click', this.closeAllDropdowns);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeAllDropdowns);
  }

  closeAllDropdowns = () => {
    this.guests.forEach(g => g['rsvpDropdownOpen'] = false);
  }

  load() { 
    this.svc.list().subscribe(g => this.guests = g); 
  }

  get brideGuests() {
    return this.guests.filter(g => g.side === 'bride');
  }
  get groomGuests() {
    return this.guests.filter(g => g.side === 'groom');
  }

  get guestsByTable() {
    const map: { [table: number]: Guest[] } = {};
    for (const g of this.guests) {
      if (g.tableNumber) {
        if (!map[g.tableNumber]) map[g.tableNumber] = [];
        map[g.tableNumber].push(g);
      }
    }
    return map;
  }

  addBrideGuest() {
    if (!this.newBrideName.trim()) return;
    this.svc.add({ name: this.newBrideName, status: 'pending', side: 'bride' })
      .subscribe(_ => { 
        this.newBrideName = ''; 
        this.load(); 
      });
  }

  addGroomGuest() {
    if (!this.newGroomName.trim()) return;
    this.svc.add({ name: this.newGroomName, status: 'pending', side: 'groom' })
      .subscribe(_ => { 
        this.newGroomName = ''; 
        this.load(); 
      });
  }

  toggle(g: Guest) {
    g.status = g.status === 'accepted' ? 'declined' : 'accepted';
    this.svc.update(g).subscribe();
  }

  remove(id: number) { 
    this.svc.remove(id).subscribe(_ => this.load()); 
  }

  updateField(g: Guest, field: keyof Guest, value: any) {
    if (field === 'rsvpDropdownOpen') {
      (g as any)['rsvpDropdownOpen'] = value;
      return;
    }
    (g as any)[field] = value;
    this.svc.update(g).subscribe(() => this.load());
  }

  startEdit(guest: Guest) {
    this.editingGuestId = guest.id;
    this.editDraft = { ...guest };
  }

  saveEdit() {
    if (this.editingGuestId == null) return;
    const updated: Guest = {
      ...(this.guests.find(g => g.id === this.editingGuestId)!),
      ...this.editDraft,
      id: this.editingGuestId
    };
    this.svc.update(updated).subscribe(() => {
      this.editingGuestId = null;
      this.editDraft = {};
      this.load();
    });
  }

  cancelEdit() {
    this.editingGuestId = null;
    this.editDraft = {};
  }

  openRsvpDropdown(g: Guest, event: Event) {
    event.stopPropagation();
    this.guests.forEach(guest => (guest as any).rsvpDropdownOpen = false);
    (g as any).rsvpDropdownOpen = true;
  }

  changeRsvpStatus(g: Guest, status: 'accepted' | 'declined' | 'pending') {
    if (g.status !== status) {
      g.status = status;
      this.svc.update(g).subscribe(() => this.load());
    }
    (g as any).rsvpDropdownOpen = false;
  }

  getGuestCircleStyle(index: number, total: number) {
    const angle = (2 * Math.PI * index) / total;
    const radius = 90; // px, distance from center
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return {
      position: 'absolute',
      left: `calc(50% + ${x}px - 18px)`,
      top: `calc(50% + ${y}px - 18px)`,
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      width: '36px',
    };
  }
}