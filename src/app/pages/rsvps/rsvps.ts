import { Component, OnInit } from '@angular/core';
import { RsvpService, Rsvp } from '../../shared/rsvp.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rsvps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rsvps.html',
  styleUrls: ['./rsvps.scss']
})
export class Rsvps implements OnInit {
  rsvps: Rsvp[] = [];

  constructor(private svc: RsvpService) {}

  ngOnInit() { 
    this.svc.list().subscribe(x => this.rsvps = x); 
  }

  respond(r: Rsvp, accepted: boolean) {
    this.svc.respond({ ...r, accepted }).subscribe(() => this.ngOnInit());
  }
}
