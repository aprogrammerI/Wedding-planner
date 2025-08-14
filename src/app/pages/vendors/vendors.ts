import { Component, OnInit } from '@angular/core';
import { VendorService, Vendor } from '../../services/vendor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendors.html',
  styleUrls: ['./vendors.scss']
})
export class Vendors implements OnInit {
  vendors: Vendor[] = [];
  newVendor: Partial<Vendor> = {};
  editingVendor: Vendor | null = null;
  showAddForm = false;
  showEditForm = false;

  constructor(private svc: VendorService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.svc.list().subscribe(v => this.vendors = v);
  }

  add() {
    if (!this.newVendor.name || !this.newVendor.category) return;
    
    this.svc.add(this.newVendor as Omit<Vendor, 'id'>).subscribe(() => {
      this.newVendor = {};
      this.showAddForm = false;
      this.load();
    });
  }

  edit(vendor: Vendor) {
    this.editingVendor = { ...vendor };
    this.showEditForm = true;
  }

  update() {
    if (!this.editingVendor) return;
    
    this.svc.update(this.editingVendor).subscribe(() => {
      this.editingVendor = null;
      this.showEditForm = false;
      this.load();
    });
  }

  remove(id: number) {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.svc.remove(id).subscribe(() => this.load());
    }
  }

  cancelEdit() {
    this.editingVendor = null;
    this.showEditForm = false;
  }

  cancelAdd() {
    this.newVendor = {};
    this.showAddForm = false;
  }
}
