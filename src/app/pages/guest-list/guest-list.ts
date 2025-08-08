import { Component, OnInit } from '@angular/core';
import { GuestService, Guest } from '../../shared/guest.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guest-list.html',
  styleUrls: ['./guest-list.scss']
})
export class GuestList implements OnInit {
  guests: Guest[] = [];
  newName = '';

  constructor(private svc: GuestService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() { 
    this.svc.list().subscribe(g => this.guests = g); 
  }

  add() {
    if (!this.newName.trim()) return;
    this.svc.add({ name: this.newName, status: 'pending' })
      .subscribe(_ => { 
        this.newName = ''; 
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
}