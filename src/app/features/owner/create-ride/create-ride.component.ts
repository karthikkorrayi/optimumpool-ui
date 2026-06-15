import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OfferService } from '../../../core/services/offer.service';

@Component({
  selector: 'app-create-ride',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './create-ride.component.html'
})
export class CreateRideComponent {

  ownerName    = '';
  ownerContact = '';
  carNum       = '';
  carModel     = '';
  totalSeats   = 4;
  availSeats   = 3;
  wayPoints    = ['', '', ''];
  distances    = [0, 0, 0];
  date         = '';
  time         = 8;
  chargePerKm  = 0;

  success = '';
  error   = '';
  loading = false;

  constructor(private offerService: OfferService) {}

  addWaypoint() {
    this.wayPoints.push('');
    this.distances.push(0);
  }

  removeWaypoint(index: number) {
    if (this.wayPoints.length > 2) {
      this.wayPoints.splice(index, 1);
      this.distances.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  submit() {
    this.error   = '';
    this.success = '';

    if (!this.carNum.trim() || !this.carModel.trim()) {
      this.error = 'Car number and model are required.';
      return;
    }
    if (this.wayPoints.some(wp => !wp.trim())) {
      this.error = 'Fill in all waypoint city names.';
      return;
    }
    if (!this.date) {
      this.error = 'Please select a date.';
      return;
    }
    if (this.chargePerKm <= 0) {
      this.error = 'Charge per km must be greater than 0.';
      return;
    }

    this.loading = true;

    const rideData = {
      car_owner: { name: this.ownerName, contact: this.ownerContact },
      car_info: {
        carNum:      this.carNum,
        model:       this.carModel,
        no_of_seats: this.totalSeats,
        avl_seats:   this.availSeats
      },
      wayPoint:      [...this.wayPoints],
      distance:      [...this.distances],
      date:          this.date,
      time:          this.time,
      charge_per_km: this.chargePerKm
    };

    this.offerService.createRide(rideData).subscribe({
      next: (_res) => {
        this.success = '✓ Ride offer created successfully!';
        this.loading = false;
        this.resetForm();
      },
      error: (err) => {
        console.error('Create ride error:', err);
        this.error   = 'Failed to create ride: ' + (err?.error || err?.message || 'server error');
        this.loading = false;
      }
    });
  }

  private resetForm() {
    this.ownerName    = '';
    this.ownerContact = '';
    this.carNum       = '';
    this.carModel     = '';
    this.totalSeats   = 4;
    this.availSeats   = 3;
    this.wayPoints    = ['', '', ''];
    this.distances    = [0, 0, 0];
    this.date         = '';
    this.time         = 8;
    this.chargePerKm  = 0;
  }
}