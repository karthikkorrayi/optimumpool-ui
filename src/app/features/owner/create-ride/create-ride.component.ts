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

  // Car owner details
  ownerName    = '';
  ownerContact = '';

  // Car info
  carNum    = '';
  carModel  = '';
  totalSeats = 4;
  availSeats = 3;

  // Route — start with 3 waypoints
  wayPoints = ['', '', ''];
  distances = [0, 0, 0];

  // Ride details
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
    this.loading = true;

    const rideData = {
      car_owner: { name: this.ownerName, contact: this.ownerContact },
      car_info:  {
        carNum: this.carNum, model: this.carModel,
        no_of_seats: this.totalSeats, avl_seats: this.availSeats
      },
      wayPoint:       this.wayPoints,
      distance:       this.distances,
      date:           this.date,
      time:           this.time,
      charge_per_km:  this.chargePerKm
    };

    this.offerService.createRide(rideData).subscribe({
      next: () => {
        this.success = 'Ride offer created successfully!';
        this.loading = false;
      },
      error: () => {
        this.error   = 'Failed to create ride. Check all fields and try again.';
        this.loading = false;
      }
    });
  }
}