import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wedding-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wedding-details.html',
  styleUrls: ['./wedding-details.scss']
})
export class WeddingDetails {
  weddingDate = new Date();
  venue = "Grand Paradise Hall";
}