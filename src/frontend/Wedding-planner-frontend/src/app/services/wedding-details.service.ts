import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Frontend interfaces (for component usage)
export interface CoupleDetails {
  brideFirstName: string;
  brideLastName: string;
  brideAge: number;
  groomFirstName: string;
  groomLastName: string;
  groomAge: number;
}

export interface EventInformation {
  date: string; // ISO date string for frontend
  location: string;
}

export interface EventItinerary {
  id?: number;
  time: string; // 12-hour format for frontend display
  event: string;
  description: string;
  isEditing?: boolean;
  hour?: number;
  minute?: number;
  amPm?: string;
}

// Backend DTO interfaces
export interface WeddingDetailsDTO {
  id?: number;
  brideFirstName: string;
  brideLastName: string;
  brideAge: number;
  groomFirstName: string;
  groomLastName: string;
  groomAge: number;
  weddingDate: string; // ISO date string
  weddingLocation: string;
}

export interface ItineraryItemDTO {
  id?: number;
  time: string; // ISO time string (24-hour format)
  eventName: string;
  description: string;
}

export interface WeddingDetailsPageDTO {
  detailsId?: number;
  weddingName?: string;
  brideFirstName: string;
  brideLastName: string;
  brideAge: number;
  groomFirstName: string;
  groomLastName: string;
  groomAge: number;
  weddingDate: string; // ISO date string
  weddingLocation: string;
  brideGuestCount: number;
  groomGuestCount: number;
  totalGuestCount: number;
  confirmedRsvpsCount: number;
  completedTasks: number;
  totalTasks: number;
  tasksCompletionPercentage: number;
  totalBudgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  budgetUtilizationPercentage: number;
  itinerary: ItineraryItemDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class WeddingDetailsService {
  private readonly API_BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Get aggregated wedding details page data
  getWeddingDetailsPage(): Observable<WeddingDetailsPageDTO> {
    return this.http.get<WeddingDetailsPageDTO>(`${this.API_BASE_URL}/details-page`).pipe(
      catchError(error => {
        console.error('Error fetching wedding details page:', error);
        return throwError(() => new Error('Failed to fetch wedding details'));
      })
    );
  }

  // Get raw wedding details
  getWeddingDetails(): Observable<WeddingDetailsDTO> {
    return this.http.get<WeddingDetailsDTO>(`${this.API_BASE_URL}/details`).pipe(
      catchError(error => {
        console.error('Error fetching wedding details:', error);
        return throwError(() => new Error('Failed to fetch wedding details'));
      })
    );
  }

  // Save wedding details
  saveWeddingDetails(details: WeddingDetailsDTO): Observable<WeddingDetailsDTO> {
    return this.http.put<WeddingDetailsDTO>(`${this.API_BASE_URL}/details`, details).pipe(
      catchError(error => {
        console.error('Error saving wedding details:', error);
        return throwError(() => new Error('Failed to save wedding details'));
      })
    );
  }

  // Itinerary methods
  getItinerary(): Observable<ItineraryItemDTO[]> {
    return this.http.get<ItineraryItemDTO[]>(`${this.API_BASE_URL}/itinerary`).pipe(
      catchError(error => {
        console.error('Error fetching itinerary:', error);
        return throwError(() => new Error('Failed to fetch itinerary'));
      })
    );
  }

  addItineraryItem(item: ItineraryItemDTO): Observable<ItineraryItemDTO> {
    return this.http.post<ItineraryItemDTO>(`${this.API_BASE_URL}/itinerary`, item).pipe(
      catchError(error => {
        console.error('Error adding itinerary item:', error);
        return throwError(() => new Error('Failed to add itinerary item'));
      })
    );
  }

  updateItineraryItem(id: number, item: ItineraryItemDTO): Observable<ItineraryItemDTO> {
    return this.http.put<ItineraryItemDTO>(`${this.API_BASE_URL}/itinerary/${id}`, item).pipe(
      catchError(error => {
        console.error('Error updating itinerary item:', error);
        return throwError(() => new Error('Failed to update itinerary item'));
      })
    );
  }

  deleteItineraryItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/itinerary/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting itinerary item:', error);
        return throwError(() => new Error('Failed to delete itinerary item'));
      })
    );
  }

  // Mapping methods between frontend and backend
  mapWeddingDetailsPageToFrontend(dto: WeddingDetailsPageDTO): {
    coupleDetails: CoupleDetails;
    eventInformation: EventInformation;
    guestSummary: any;
    checklistProgress: any;
    budgetOverview: any;
    eventItinerary: EventItinerary[];
  } {
    return {
      coupleDetails: {
        brideFirstName: dto.brideFirstName || '',
        brideLastName: dto.brideLastName || '',
        brideAge: dto.brideAge || 0,
        groomFirstName: dto.groomFirstName || '',
        groomLastName: dto.groomLastName || '',
        groomAge: dto.groomAge || 0
      },
      eventInformation: {
        date: dto.weddingDate || '',
        location: dto.weddingLocation || ''
      },
      guestSummary: {
        brideGuests: dto.brideGuestCount || 0,
        groomGuests: dto.groomGuestCount || 0,
        totalGuests: dto.totalGuestCount || 0,
        confirmedRSVPs: dto.confirmedRsvpsCount || 0
      },
      checklistProgress: {
        totalTasks: dto.totalTasks || 0,
        completedTasks: dto.completedTasks || 0,
        progressPercentage: dto.tasksCompletionPercentage || 0
      },
      budgetOverview: {
        totalBudget: dto.totalBudgetAmount || 0,
        spentAmount: dto.spentAmount || 0,
        remainingAmount: dto.remainingAmount || 0,
        progressPercentage: dto.budgetUtilizationPercentage || 0
      },
      eventItinerary: dto.itinerary ? dto.itinerary.map(item => this.mapItineraryItemToFrontend(item)) : []
    };
  }

  mapItineraryItemToFrontend(dto: ItineraryItemDTO): EventItinerary {
    return {
      id: dto.id,
      time: this.convertTimeTo12Hour(dto.time),
      event: dto.eventName,
      description: dto.description,
      isEditing: false,
      hour: this.getHourFrom24HourTime(dto.time),
      minute: this.getMinuteFrom24HourTime(dto.time),
      amPm: this.getAmPmFrom24HourTime(dto.time)
    };
  }

  mapItineraryItemToBackend(item: EventItinerary): ItineraryItemDTO {
    return {
      id: item.id,
      time: this.convertTimeTo24Hour(item.time),
      eventName: item.event,
      description: item.description
    };
  }

  mapCoupleDetailsToBackend(coupleDetails: CoupleDetails, eventInfo: EventInformation): WeddingDetailsDTO {
    return {
      brideFirstName: coupleDetails.brideFirstName,
      brideLastName: coupleDetails.brideLastName,
      brideAge: coupleDetails.brideAge,
      groomFirstName: coupleDetails.groomFirstName,
      groomLastName: coupleDetails.groomLastName,
      groomAge: coupleDetails.groomAge,
      weddingDate: eventInfo.date,
      weddingLocation: eventInfo.location
    };
  }

  // Time conversion utilities
  private convertTimeTo12Hour(time24: string): string {
    if (!time24) return '12:00 PM';
    
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    let hours12 = hours % 12;
    if (hours12 === 0) hours12 = 12;
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  private convertTimeTo24Hour(time12: string): string {
    if (!time12) return '12:00';
    
    const [time, period] = time12.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hours24 = hours;
    if (period === 'AM' && hours === 12) {
      hours24 = 0;
    } else if (period === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    }
    
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private getHourFrom24HourTime(time24: string): number {
    if (!time24) return 12;
    const [hours] = time24.split(':').map(Number);
    let hours12 = hours % 12;
    if (hours12 === 0) hours12 = 12;
    return hours12;
  }

  private getMinuteFrom24HourTime(time24: string): number {
    if (!time24) return 0;
    const [, minutes] = time24.split(':').map(Number);
    return minutes;
  }

  private getAmPmFrom24HourTime(time24: string): string {
    if (!time24) return 'PM';
    const [hours] = time24.split(':').map(Number);
    return hours >= 12 ? 'PM' : 'AM';
  }
}
