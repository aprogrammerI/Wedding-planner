import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { WeddingDetailsService, CoupleDetails, EventInformation, EventItinerary } from '../../services/wedding-details.service';

interface GuestSummary {
  brideGuests: number;
  groomGuests: number;
  totalGuests: number;
  confirmedRSVPs: number;
}

interface ChecklistProgress {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

interface BudgetOverview {
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
}

@Component({
  selector: 'app-wedding-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './wedding-details.html',
  styleUrls: ['./wedding-details.scss']
})
export class WeddingDetails implements OnInit {
  coupleDetails: CoupleDetails = {
    brideFirstName: '',
    brideLastName: '',
    brideAge: 0,
    groomFirstName: '',
    groomLastName: '',
    groomAge: 0
  };

  eventInformation: EventInformation = {
    date: '',
    location: ''
  };

  // Guest summary - will be populated from real data
  guestSummary: GuestSummary = {
    brideGuests: 0,
    groomGuests: 0,
    totalGuests: 0,
    confirmedRSVPs: 0
  };

  // Checklist progress - will be populated from real data
  checklistProgress: ChecklistProgress = {
    totalTasks: 0,
    completedTasks: 0,
    progressPercentage: 0
  };

  // Budget overview - will be populated from real data
  budgetOverview: BudgetOverview = {
    totalBudget: 0,
    spentAmount: 0,
    remainingAmount: 0,
    progressPercentage: 0
  };

  eventItinerary: EventItinerary[] = [
    { time: '2:00 PM', event: 'Ceremony', description: 'Wedding ceremony at the venue', isEditing: false },
    { time: '3:00 PM', event: 'Cocktail Hour', description: 'Drinks and appetizers', isEditing: false },
    { time: '4:00 PM', event: 'Reception', description: 'Dinner and dancing', isEditing: false },
    { time: '5:00 PM', event: 'First Dance', description: 'Couple\'s first dance', isEditing: false },
    { time: '6:00 PM', event: 'Cake Cutting', description: 'Wedding cake ceremony', isEditing: false },
    { time: '7:00 PM', event: 'Bouquet Toss', description: 'Traditional bouquet toss', isEditing: false },
    { time: '8:00 PM', event: 'Garter Toss', description: 'Traditional garter toss', isEditing: false },
    { time: '9:00 PM', event: 'Open Dancing', description: 'Party continues', isEditing: false },
    { time: '11:00 PM', event: 'Grand Exit', description: 'Sparkler send-off', isEditing: false }
  ];

  showCouplePhoto = false;
  showDatePicker = false;
  showLocationInput = false;
  
  newItineraryItem: EventItinerary = { time: '', event: '', description: '', hour: 12, minute: 0, amPm: 'PM' };

  constructor(
    private authService: AuthService,
    private weddingDetailsService: WeddingDetailsService
  ) {}

  ngOnInit() {
    this.loadWeddingDetails();
  }

  private loadWeddingDetails() {
    this.weddingDetailsService.getWeddingDetailsPage().subscribe({
      next: (data) => {
        const frontendData = this.weddingDetailsService.mapWeddingDetailsPageToFrontend(data);
        
        // Update component properties
        this.coupleDetails = frontendData.coupleDetails;
        this.eventInformation = frontendData.eventInformation;
        this.guestSummary = frontendData.guestSummary;
        this.checklistProgress = frontendData.checklistProgress;
        this.budgetOverview = frontendData.budgetOverview;
        this.eventItinerary = frontendData.eventItinerary;
        
        // Show couple photo if details are available
        if (this.coupleDetails.brideFirstName && this.coupleDetails.groomFirstName) {
          this.showCouplePhoto = true;
        }
        
        // Sort itinerary by time
        this.sortItineraryByTime();
      },
      error: (error) => {
        console.error('Error loading wedding details:', error);
        // Keep default values if there's an error
        this.loadFallbackData();
      }
    });
  }

  private loadFallbackData() {
    // Fallback to localStorage if backend fails
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const userId = currentUser.id;
    
    // Load couple details from localStorage
    const savedCoupleDetails = localStorage.getItem(`weddingCoupleDetails_${userId}`);
    if (savedCoupleDetails) {
      this.coupleDetails = JSON.parse(savedCoupleDetails);
      if (this.coupleDetails.brideFirstName && this.coupleDetails.groomFirstName) {
        this.showCouplePhoto = true;
      }
    }

    // Load event information from localStorage
    const savedEventInfo = localStorage.getItem(`weddingEventInfo_${userId}`);
    if (savedEventInfo) {
      this.eventInformation = JSON.parse(savedEventInfo);
    }

    // Load event itinerary from localStorage
    const savedItinerary = localStorage.getItem(`weddingItinerary_${userId}`);
    if (savedItinerary) {
      this.eventItinerary = JSON.parse(savedItinerary);
      this.sortItineraryByTime();
    }
  }


  saveCoupleDetails() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Create backend DTO
    const weddingDetailsDTO = this.weddingDetailsService.mapCoupleDetailsToBackend(
      this.coupleDetails, 
      this.eventInformation
    );

    // Save to backend
    this.weddingDetailsService.saveWeddingDetails(weddingDetailsDTO).subscribe({
      next: () => {
        console.log('Couple details saved to backend');
        // Show the couple photo with names
        this.showCouplePhoto = true;
        // Reload data to get updated information
        this.loadWeddingDetails();
      },
      error: (error) => {
        console.error('Error saving couple details:', error);
        // Fallback to localStorage
        localStorage.setItem(`weddingCoupleDetails_${currentUser.id}`, JSON.stringify(this.coupleDetails));
        this.showCouplePhoto = true;
        alert('Failed to save to backend. Data saved locally.');
      }
    });
  }

  editCoupleDetails() {
    // Hide the photo and return to edit mode
    this.showCouplePhoto = false;
  }

  saveEventInformation() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Create backend DTO
    const weddingDetailsDTO = this.weddingDetailsService.mapCoupleDetailsToBackend(
      this.coupleDetails, 
      this.eventInformation
    );

    // Save to backend
    this.weddingDetailsService.saveWeddingDetails(weddingDetailsDTO).subscribe({
      next: () => {
        console.log('Event information saved to backend');
        // Reload data to get updated information
        this.loadWeddingDetails();
      },
      error: (error) => {
        console.error('Error saving event information:', error);
        // Fallback to localStorage
        localStorage.setItem(`weddingEventInfo_${currentUser.id}`, JSON.stringify(this.eventInformation));
        alert('Failed to save to backend. Data saved locally.');
      }
    });
  }

  editEventDate() {
    this.eventInformation.date = '';
  }

  onDateChange() {
    // Auto-save when date is changed
    if (this.eventInformation.date) {
      this.saveEventInformation();
    }
  }

  saveLocation() {
    // Save event information when location is updated
    if (this.eventInformation.location && this.eventInformation.location.trim()) {
      this.saveEventInformation();
    }
  }

  editLocation() {
    this.eventInformation.location = '';
  }

  toggleDatePicker(event: Event) {
    event.preventDefault();
    this.showDatePicker = !this.showDatePicker;
    if (this.showDatePicker) {
      this.showLocationInput = false; // Close location input if open
    }
  }

  toggleLocationInput(event: Event) {
    event.preventDefault();
    this.showLocationInput = !this.showLocationInput;
    if (this.showLocationInput) {
      this.showDatePicker = false; // Close date picker if open
    }
  }

  // Itinerary editing methods
  startEditItem(index: number) {
    this.eventItinerary[index].isEditing = true;
  }

  saveItem(index: number) {
    const item = this.eventItinerary[index];
    if (!item.id) {
      // New item - add to backend
      const backendItem = this.weddingDetailsService.mapItineraryItemToBackend(item);
      this.weddingDetailsService.addItineraryItem(backendItem).subscribe({
        next: (savedItem) => {
          this.eventItinerary[index] = this.weddingDetailsService.mapItineraryItemToFrontend(savedItem);
          this.eventItinerary[index].isEditing = false;
          this.sortItineraryByTime();
        },
        error: (error) => {
          console.error('Error saving itinerary item:', error);
          alert('Failed to save itinerary item. Please try again.');
        }
      });
    } else {
      // Existing item - update in backend
      const backendItem = this.weddingDetailsService.mapItineraryItemToBackend(item);
      this.weddingDetailsService.updateItineraryItem(item.id, backendItem).subscribe({
        next: (savedItem) => {
          this.eventItinerary[index] = this.weddingDetailsService.mapItineraryItemToFrontend(savedItem);
          this.eventItinerary[index].isEditing = false;
          this.sortItineraryByTime();
        },
        error: (error) => {
          console.error('Error updating itinerary item:', error);
          alert('Failed to update itinerary item. Please try again.');
        }
      });
    }
  }

  cancelEditItem(index: number) {
    // Reset to original values if needed
    this.eventItinerary[index].isEditing = false;
    // Reload data to get original values
    this.loadWeddingDetails();
  }

  removeItineraryItem(index: number) {
    const item = this.eventItinerary[index];
    if (!item.id) {
      // New item not yet saved - just remove from array
      this.eventItinerary.splice(index, 1);
      return;
    }

    // Delete from backend
    this.weddingDetailsService.deleteItineraryItem(item.id).subscribe({
      next: () => {
        this.eventItinerary.splice(index, 1);
        console.log('Itinerary item removed from backend');
      },
      error: (error) => {
        console.error('Error deleting itinerary item:', error);
        alert('Failed to delete itinerary item. Please try again.');
      }
    });
  }

  updateItineraryItem(index: number, field: keyof EventItinerary, event: any) {
    if (field !== 'isEditing') {
      const value = event.target?.value;
      if (value !== undefined) {
        (this.eventItinerary[index] as any)[field] = value;
      }
    }
  }

  // Time picker methods
  getHours() {
    return [
      { value: 12, display: '12' },
      { value: 1, display: '1' },
      { value: 2, display: '2' },
      { value: 3, display: '3' },
      { value: 4, display: '4' },
      { value: 5, display: '5' },
      { value: 6, display: '6' },
      { value: 7, display: '7' },
      { value: 8, display: '8' },
      { value: 9, display: '9' },
      { value: 10, display: '10' },
      { value: 11, display: '11' }
    ];
  }

  getMinutes() {
    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  }

  getHourFromTime(timeStr: string): number {
    if (!timeStr) return 12;
    const [time, amPm] = timeStr.split(' ');
    const [hour] = time.split(':');
    return parseInt(hour);
  }

  getMinuteFromTime(timeStr: string): number {
    if (!timeStr) return 0;
    const [time] = timeStr.split(' ');
    const [, minute] = time.split(':');
    return parseInt(minute);
  }

  getAmPmFromTime(timeStr: string): string {
    if (!timeStr) return 'PM';
    const parts = timeStr.split(' ');
    return parts[parts.length - 1] || 'PM';
  }

  updateTimeHour(index: number, event: any) {
    const hour = parseInt(event.target.value);
    this.eventItinerary[index].hour = hour;
    this.updateTimeString(index);
  }

  updateTimeMinute(index: number, event: any) {
    const minute = parseInt(event.target.value);
    this.eventItinerary[index].minute = minute;
    this.updateTimeString(index);
  }

  updateTimeAmPm(index: number, event: any) {
    const amPm = event.target.value;
    this.eventItinerary[index].amPm = amPm;
    this.updateTimeString(index);
  }

  updateTimeString(index: number) {
    const item = this.eventItinerary[index];
    const hour = item.hour || 12;
    const minute = item.minute || 0;
    const amPm = item.amPm || 'PM';
    this.eventItinerary[index].time = `${hour}:${minute.toString().padStart(2, '0')} ${amPm}`;
    
    // Sort itinerary after time update
    this.sortItineraryByTime();
  }

  sortItineraryByTime() {
    this.eventItinerary.sort((a, b) => {
      return this.compareTimes(a.time, b.time);
    });
  }

  compareTimes(timeA: string, timeB: string): number {
    // Parse time strings like "2:30 PM" or "11:45 AM"
    const parseTime = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      const [hour, minute] = time.split(':').map(Number);
      
      // Convert to 24-hour format for comparison
      let hour24 = hour;
      if (period === 'AM' && hour === 12) {
        hour24 = 0; // 12:XX AM becomes 00:XX
      } else if (period === 'PM' && hour !== 12) {
        hour24 = hour + 12; // 1:XX PM becomes 13:XX
      }
      
      return hour24 * 60 + minute; // Convert to minutes since midnight
    };

    return parseTime(timeA) - parseTime(timeB);
  }

  addItineraryItem() {
    if (this.newItineraryItem.event && this.newItineraryItem.description) {
      // Create time string from individual components
      const hour = this.newItineraryItem.hour || 12;
      const minute = this.newItineraryItem.minute || 0;
      const amPm = this.newItineraryItem.amPm || 'PM';
      const timeString = `${hour}:${minute.toString().padStart(2, '0')} ${amPm}`;

      const newItem: EventItinerary = { 
        time: timeString,
        event: this.newItineraryItem.event, 
        description: this.newItineraryItem.description,
        isEditing: false 
      };

      // Add to backend
      const backendItem = this.weddingDetailsService.mapItineraryItemToBackend(newItem);
      this.weddingDetailsService.addItineraryItem(backendItem).subscribe({
        next: (savedItem) => {
          const frontendItem = this.weddingDetailsService.mapItineraryItemToFrontend(savedItem);
          this.eventItinerary.push(frontendItem);
          
          // Sort itinerary by time
          this.sortItineraryByTime();
          
          // Reset form
          this.newItineraryItem = { 
            time: '', 
            event: '', 
            description: '', 
            hour: 12, 
            minute: 0, 
            amPm: 'PM' 
          };
          
          console.log('New itinerary item added to backend');
        },
        error: (error) => {
          console.error('Error adding itinerary item:', error);
          alert('Failed to add itinerary item. Please try again.');
        }
      });
    }
  }
}
