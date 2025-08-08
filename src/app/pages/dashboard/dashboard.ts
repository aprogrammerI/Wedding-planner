import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h2>Dashboard</h2>
    <p>Welcome to your dashboard! (Placeholder content.)</p>
  `,
  styles: [`
    h2 { color: #007bff; }
    p  { font-size: 1.1rem; }
  `]
})
export class Dashboard {}