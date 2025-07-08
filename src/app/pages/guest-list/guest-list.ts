import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guest-list.html',
  styleUrls: ['./guest-list.scss']
})
export class GuestList {
  guests = ['Ana', 'Marija', 'Borjan'];
}