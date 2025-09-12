import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { GuestService, Guest } from '../../services/guest.service';
import { TaskService, Task } from '../../services/task.service';
import { BudgetService, Expense } from '../../services/budget.service';

interface CoupleDetails {
  brideFirstName: string;
  brideLastName: string;
  brideAge: number;
  groomFirstName: string;
  groomLastName: string;
  groomAge: number;
}

interface EventInformation {
  date: string;
  location: string;
}

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

interface EventItinerary {
  time: string;
  event: string;
  description: string;
  isEditing?: boolean;
  hour?: number;
  minute?: number;
  amPm?: string;
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
    private guestService: GuestService,
    private taskService: TaskService,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    this.loadWeddingDetails();
    this.loadRealData();
  }

  private calculateGuestSummary(guests: Guest[]) {
    const brideGuests = guests.filter(g => g.side === 'bride').length;
    const groomGuests = guests.filter(g => g.side === 'groom').length;
    const confirmedRSVPs = guests.filter(g => g.status === 'accepted').length;

    this.guestSummary = {
      brideGuests,
      groomGuests,
      totalGuests: guests.length,
      confirmedRSVPs
    };
  }

  private calculateTaskProgress(tasks: Task[]) {
    const completedTasks = tasks.filter(t => t.done).length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    this.checklistProgress = {
      completedTasks,
      totalTasks,
      progressPercentage
    };
  }

  private calculateBudgetOverview(expenses: Expense[]) {
    const spentAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    // Get the actual budget from localStorage (same as budget page)
    const totalBudget = Number(localStorage.getItem('userBudget')) || 0;
    const remainingAmount = Math.max(0, totalBudget - spentAmount);
    const progressPercentage = totalBudget > 0 ? Math.min(100, Math.round((spentAmount / totalBudget) * 100)) : 0;

    this.budgetOverview = {
      totalBudget,
      spentAmount,
      remainingAmount,
      progressPercentage
    };
  }

  private loadWeddingDetails() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const userId = currentUser.id;
    
    // Load couple details from localStorage with user-specific key
    const savedCoupleDetails = localStorage.getItem(`weddingCoupleDetails_${userId}`);
    if (savedCoupleDetails) {
      this.coupleDetails = JSON.parse(savedCoupleDetails);
      // Show the couple photo if details are already saved
      if (this.coupleDetails.brideFirstName && this.coupleDetails.groomFirstName) {
        this.showCouplePhoto = true;
      }
    }

    // Load event information from localStorage with user-specific key
    const savedEventInfo = localStorage.getItem(`weddingEventInfo_${userId}`);
    if (savedEventInfo) {
      this.eventInformation = JSON.parse(savedEventInfo);
    }

    // Load event itinerary from localStorage with user-specific key
    const savedItinerary = localStorage.getItem(`weddingItinerary_${userId}`);
    if (savedItinerary) {
      this.eventItinerary = JSON.parse(savedItinerary);
      // Sort existing itinerary by time
      this.sortItineraryByTime();
    }
  }

  private loadRealData() {
    // Load guest data
    this.guestService.list().subscribe({
      next: (guests) => {
        this.calculateGuestSummary(guests);
      },
      error: (error) => {
        console.error('Error loading guest data:', error);
        // Keep default values if there's an error
      }
    });

    // Load task data
    this.taskService.list().subscribe({
      next: (tasks) => {
        this.calculateTaskProgress(tasks);
      },
      error: (error) => {
        console.error('Error loading task data:', error);
        // Keep default values if there's an error
      }
    });

    // Load budget data
    this.budgetService.list().subscribe({
      next: (expenses) => {
        this.calculateBudgetOverview(expenses);
      },
      error: (error) => {
        console.error('Error loading budget data:', error);
        // Keep default values if there's an error
      }
    });
  }


  saveCoupleDetails() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Save couple details to localStorage with user-specific key
    localStorage.setItem(`weddingCoupleDetails_${currentUser.id}`, JSON.stringify(this.coupleDetails));
    console.log('Couple details saved for user:', currentUser.id, this.coupleDetails);
    
    // Show the couple photo with names
    this.showCouplePhoto = true;
  }

  editCoupleDetails() {
    // Hide the photo and return to edit mode
    this.showCouplePhoto = false;
  }

  saveEventInformation() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Save event information to localStorage with user-specific key
    localStorage.setItem(`weddingEventInfo_${currentUser.id}`, JSON.stringify(this.eventInformation));
    console.log('Event information saved for user:', currentUser.id, this.eventInformation);
  }

  editEventDate() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.eventInformation.date = '';
    // Save the cleared date with user-specific key
    localStorage.setItem(`weddingEventInfo_${currentUser.id}`, JSON.stringify(this.eventInformation));
    console.log('Date cleared for user:', currentUser.id);
  }

  onDateChange() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Auto-save when date is changed
    if (this.eventInformation.date) {
      localStorage.setItem(`weddingEventInfo_${currentUser.id}`, JSON.stringify(this.eventInformation));
      console.log('Date saved for user:', currentUser.id, this.eventInformation.date);
    }
  }

  saveLocation() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Save event information to localStorage when location is updated
    if (this.eventInformation.location && this.eventInformation.location.trim()) {
      localStorage.setItem(`weddingEventInfo_${currentUser.id}`, JSON.stringify(this.eventInformation));
      console.log('Location saved for user:', currentUser.id, this.eventInformation.location);
    }
  }

  editLocation() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.eventInformation.location = '';
    // Save the cleared location with user-specific key
    localStorage.setItem(`weddingEventInfo_${currentUser.id}`, JSON.stringify(this.eventInformation));
    console.log('Location cleared for user:', currentUser.id);
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
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.eventItinerary[index].isEditing = false;
    // Save itinerary to localStorage with user-specific key
    localStorage.setItem(`weddingItinerary_${currentUser.id}`, JSON.stringify(this.eventItinerary));
    console.log('Itinerary item saved for user:', currentUser.id);
  }

  cancelEditItem(index: number) {
    // Reset to original values if needed
    this.eventItinerary[index].isEditing = false;
  }


  removeItineraryItem(index: number) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.eventItinerary.splice(index, 1);
    // Save itinerary to localStorage with user-specific key
    localStorage.setItem(`weddingItinerary_${currentUser.id}`, JSON.stringify(this.eventItinerary));
    console.log('Itinerary item removed for user:', currentUser.id);
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
    
    // Save to localStorage
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      localStorage.setItem(`weddingItinerary_${currentUser.id}`, JSON.stringify(this.eventItinerary));
    }
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
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    if (this.newItineraryItem.event && this.newItineraryItem.description) {
      // Create time string from individual components
      const hour = this.newItineraryItem.hour || 12;
      const minute = this.newItineraryItem.minute || 0;
      const amPm = this.newItineraryItem.amPm || 'PM';
      const timeString = `${hour}:${minute.toString().padStart(2, '0')} ${amPm}`;

      this.eventItinerary.push({ 
        time: timeString,
        event: this.newItineraryItem.event, 
        description: this.newItineraryItem.description,
        isEditing: false 
      });
      
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
      
      // Save itinerary to localStorage with user-specific key
      localStorage.setItem(`weddingItinerary_${currentUser.id}`, JSON.stringify(this.eventItinerary));
      console.log('New itinerary item added and sorted for user:', currentUser.id);
    }
  }
}
