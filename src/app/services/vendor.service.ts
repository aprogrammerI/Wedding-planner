import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Vendor {
  id: number;
  name: string;
  category: string;
  phone?: string;
  email?: string;
  website?: string;
}

export const VENDOR_CATEGORIES: string[] = [
  'Event Planning',
  'Photography',
  'Catering',
  'Flowers',
  'Music',
  'Venues'
];

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private vendors: Vendor[] = [
    { id: 1, name: 'Elegant Events', category: 'Event Planning', phone: '555-0101', email: 'info@elegantevents.com', website: 'www.elegantevents.com' },
    { id: 2, name: 'Bliss Photography', category: 'Photography', phone: '555-0102', email: 'hello@blissphoto.com', website: 'www.blissphoto.com' },
    { id: 3, name: 'Sweet Dreams Bakery', category: 'Catering', phone: '555-0103', email: 'orders@sweetdreams.com', website: 'www.sweetdreams.com' },
    { id: 4, name: 'Floral Fantasy', category: 'Flowers', phone: '555-0104', email: 'flowers@floralfantasy.com', website: 'www.floralfantasy.com' },
    { id: 5, name: 'Melody Makers', category: 'Music', phone: '555-0105', email: 'book@melodymakers.com', website: 'www.melodymakers.com' },
    { id: 6, name: 'Grand Venues', category: 'Venues', phone: '555-0106', email: 'info@grandvenues.com', website: 'www.grandvenues.com' }
  ];

  private nextId = 7;

  list(): Observable<Vendor[]> {
    return of(this.vendors).pipe(delay(100));
  }

  add(vendor: Omit<Vendor, 'id'>): Observable<Vendor> {
    const newVendor: Vendor = {
      ...vendor,
      id: this.nextId++
    };
    this.vendors.push(newVendor);
    return of(newVendor).pipe(delay(100));
  }

  update(vendor: Vendor): Observable<Vendor> {
    const index = this.vendors.findIndex(v => v.id === vendor.id);
    if (index !== -1) {
      this.vendors[index] = vendor;
    }
    return of(vendor).pipe(delay(100));
  }

  remove(id: number): Observable<void> {
    this.vendors = this.vendors.filter(v => v.id !== id);
    return of(void 0).pipe(delay(100));
  }

  getById(id: number): Observable<Vendor | undefined> {
    const vendor = this.vendors.find(v => v.id === id);
    return of(vendor).pipe(delay(100));
  }
}
