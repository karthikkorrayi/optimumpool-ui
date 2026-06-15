import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { OfferService } from '../../../core/services/offer.service';

@Component({
  selector: 'app-search-rides',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './search-rides.component.html'
})
export class SearchRidesComponent {

  from     = '';
  to       = '';
  rides: any[] = [];
  searched = false;
  loading  = false;
  error    = '';

  bookingRideId = '';
  seatsWanted   = 1;
  bookMessage   = '';
  bookError     = '';
  bookLoading   = false;

  constructor(
    private bookingService: BookingService,
    private offerService: OfferService
  ) {}

  search() {
    if (!this.from.trim() || !this.to.trim()) {
      this.error = 'Please enter both From and To cities.';
      return;
    }

    this.error    = '';
    this.rides    = [];
    this.searched = false;
    this.loading  = true;
    this.bookingRideId = '';
    this.bookMessage   = '';
    this.bookError     = '';

    // Sync rides from OfferRide → BookRide via RabbitMQ, then filter
    this.offerService.getAllRides().subscribe({
      next: () => {
        this.bookingService.filterRides(this.from.trim(), this.to.trim()).subscribe({
          next: (data) => {
            this.rides    = data;
            this.searched = true;
            this.loading  = false;
          },
          error: (err) => {
            this.error   = err?.status === 401
              ? 'Session expired. Please login again.'
              : 'Search failed. Try again.';
            this.loading = false;
          }
        });
      },
      error: () => {
        // OfferRide sync failed — try searching BookRide directly with what it has
        this.bookingService.filterRides(this.from.trim(), this.to.trim()).subscribe({
          next: (data) => {
            this.rides    = data;
            this.searched = true;
            this.loading  = false;
          },
          error: () => {
            this.error   = 'Could not connect to services. Are all three backend services running?';
            this.loading = false;
          }
        });
      }
    });
  }

  startBooking(rideId: string) {
    this.bookingRideId = rideId;
    this.bookMessage   = '';
    this.bookError     = '';
    this.seatsWanted   = 1;
  }

  confirmBooking(rideId: string) {
    this.bookMessage = '';
    this.bookError   = '';
    this.bookLoading = true;

    this.bookingService.bookRide(rideId, this.seatsWanted, this.from.trim(), this.to.trim())
      .subscribe({
        next: (res: any) => {
          this.bookMessage   = `✓ Booked! ID: ${res.booking_id}. Waiting for owner to accept.`;
          this.bookLoading   = false;
          this.bookingRideId = '';
          // Refresh ride list to show updated seat count
          this.bookingService.filterRides(this.from.trim(), this.to.trim()).subscribe({
            next: (data) => this.rides = data
          });
        },
        error: (err) => {
          this.bookError   = 'Booking failed: ' + (err?.error || 'Unknown error');
          this.bookLoading = false;
        }
      });
  }

  cancelBooking() {
    this.bookingRideId = '';
    this.bookMessage   = '';
    this.bookError     = '';
  }
}