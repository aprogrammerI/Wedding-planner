import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
}

@Component({
  selector: 'app-wedding-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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

  selectedPhotos: File[] = [];
  photoPreviewUrls: string[] = [];
  showCouplePhoto = false;
  showDatePicker = false;
  showLocationInput = false;
  
  newItineraryItem: EventItinerary = { time: '', event: '', description: '' };

  constructor(
    private authService: AuthService,
    private guestService: GuestService,
    private taskService: TaskService,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
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

  onPhotoSelect(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedPhotos.push(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photoPreviewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number) {
    this.selectedPhotos.splice(index, 1);
    this.photoPreviewUrls.splice(index, 1);
  }

  saveCoupleDetails() {
    // Save couple details logic here
    console.log('Couple details saved:', this.coupleDetails);
    
    // Show the couple photo with names
    this.showCouplePhoto = true;
  }

  editCoupleDetails() {
    // Hide the photo and return to edit mode
    this.showCouplePhoto = false;
  }

  saveEventInformation() {
    // Save event information logic here
    console.log('Event information saved:', this.eventInformation);
  }

  editEventDate() {
    this.eventInformation.date = '';
  }

  saveLocation() {
    // Location is automatically saved when Enter is pressed due to ngModel binding
    // This method can be used for any additional logic if needed
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
    this.eventItinerary[index].isEditing = false;
  }

  cancelEditItem(index: number) {
    // Reset to original values if needed
    this.eventItinerary[index].isEditing = false;
  }

  addItineraryItem() {
    if (this.newItineraryItem.time && this.newItineraryItem.event && this.newItineraryItem.description) {
      this.eventItinerary.push({ 
        ...this.newItineraryItem, 
        isEditing: false 
      });
      this.newItineraryItem = { time: '', event: '', description: '' };
    }
  }

  removeItineraryItem(index: number) {
    this.eventItinerary.splice(index, 1);
  }

  updateItineraryItem(index: number, field: keyof EventItinerary, event: any) {
    if (field !== 'isEditing') {
      const value = event.target?.value;
      if (value !== undefined) {
        this.eventItinerary[index][field] = value;
      }
    }
  }
}
