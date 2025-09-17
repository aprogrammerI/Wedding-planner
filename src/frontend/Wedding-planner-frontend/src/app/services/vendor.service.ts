import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Frontend interfaces (for component usage)
export interface Vendor {
  id: number;
  name: string;
  category: string;
  phone?: string;
  email?: string;
  website?: string;
}

// Backend DTO interfaces
export interface VendorDTO {
  id: number;
  name: string;
  category: string;
  phone?: string;
  email?: string;
  website?: string;
  assignedTasks: TaskSummaryDTO[];
}

export interface CreateVendorRequest {
  name: string;
  category: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface TaskSummaryDTO {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string; // ISO date string
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
  private readonly API_BASE_URL = 'http://localhost:8080/api/vendors';

  constructor(private http: HttpClient) {}

  // Mapping methods between frontend and backend
  private mapVendorDTOToVendor(dto: VendorDTO): Vendor {
    return {
      id: dto.id,
      name: dto.name,
      category: dto.category,
      phone: dto.phone,
      email: dto.email,
      website: dto.website
    };
  }

  private mapVendorToCreateRequest(vendor: Omit<Vendor, 'id'>): CreateVendorRequest {
    return {
      name: vendor.name,
      category: vendor.category,
      phone: vendor.phone,
      email: vendor.email,
      website: vendor.website
    };
  }

  list(): Observable<VendorDTO[]> {
    return this.http.get<VendorDTO[]>(this.API_BASE_URL).pipe(
      catchError(error => {
        console.error('Error fetching vendors:', error);
        return throwError(() => new Error('Failed to fetch vendors'));
      })
    );
  }

  add(vendor: Omit<Vendor, 'id'>): Observable<Vendor> {
    const createRequest = this.mapVendorToCreateRequest(vendor);
    return this.http.post<VendorDTO>(this.API_BASE_URL, createRequest).pipe(
      map(dto => this.mapVendorDTOToVendor(dto)),
      catchError(error => {
        console.error('Error creating vendor:', error);
        return throwError(() => new Error('Failed to create vendor'));
      })
    );
  }

  update(vendor: Vendor): Observable<Vendor> {
    const createRequest = this.mapVendorToCreateRequest(vendor);
    return this.http.put<VendorDTO>(`${this.API_BASE_URL}/${vendor.id}`, createRequest).pipe(
      map(dto => this.mapVendorDTOToVendor(dto)),
      catchError(error => {
        console.error('Error updating vendor:', error);
        return throwError(() => new Error('Failed to update vendor'));
      })
    );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting vendor:', error);
        return throwError(() => new Error('Failed to delete vendor'));
      })
    );
  }

  getById(id: number): Observable<Vendor> {
    return this.http.get<VendorDTO>(`${this.API_BASE_URL}/${id}`).pipe(
      map(dto => this.mapVendorDTOToVendor(dto)),
      catchError(error => {
        console.error('Error fetching vendor:', error);
        return throwError(() => new Error('Failed to fetch vendor'));
      })
    );
  }

  // New methods for task assignment
  assignTask(vendorId: number, taskId: number): Observable<Vendor> {
    return this.http.post<VendorDTO>(`${this.API_BASE_URL}/${vendorId}/assign?taskId=${taskId}`, {}).pipe(
      map(dto => this.mapVendorDTOToVendor(dto)),
      catchError(error => {
        console.error('Error assigning task to vendor:', error);
        return throwError(() => new Error('Failed to assign task to vendor'));
      })
    );
  }

  unassignTask(vendorId: number, taskId: number): Observable<Vendor> {
    return this.http.delete<VendorDTO>(`${this.API_BASE_URL}/${vendorId}/assign/${taskId}`).pipe(
      map(dto => this.mapVendorDTOToVendor(dto)),
      catchError(error => {
        console.error('Error unassigning task from vendor:', error);
        return throwError(() => new Error('Failed to unassign task from vendor'));
      })
    );
  }

  getAvailableTasks(vendorId: number): Observable<TaskSummaryDTO[]> {
    return this.http.get<TaskSummaryDTO[]>(`${this.API_BASE_URL}/${vendorId}/available-tasks`).pipe(
      catchError(error => {
        console.error('Error fetching available tasks:', error);
        return throwError(() => new Error('Failed to fetch available tasks'));
      })
    );
  }
}
