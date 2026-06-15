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

  from  = '';
  to    = '';
  rides: any[] = [];
  searched = false;
  loading  = false;
  error    = '';

  // Booking form state
  bookingRideId = '';
  seatsWanted   = 1;
  bookMessage   = '';
  bookLoading   = false;

  constructor(
    private bookingService: BookingService,
    private offerService: OfferService
  ) {}

  // First sync rides from OfferRide, then search
  search() {
    this.error    = '';
    this.rides    = [];
    this.searched = false;
    this.loading  = true;

    // Trigger RabbitMQ sync, then search
    this.offerService.getAllRides().subscribe({
      next: () => {
        this.bookingService.filterRides(this.from, this.to).subscribe({
          next: (data) => {
            this.rides    = data;
            this.searched = true;
            this.loading  = false;
          },
          error: () => {
            this.error   = 'Search failed. Try again.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error   = 'Could not sync rides. Is OfferRide service running?';
        this.loading = false;
      }
    });
  }

  startBooking(rideId: string) {
    this.bookingRideId = rideId;
    this.bookMessage   = '';
    this.seatsWanted   = 1;
  }

  confirmBooking(rideId: string) {
    this.bookMessage = '';
    this.bookLoading = true;

    this.bookingService.bookRide(rideId, this.seatsWanted, this.from, this.to)
      .subscribe({
        next: (res: any) => {
          this.bookMessage   = `Booked! Your booking ID is ${res.booking_id}. Waiting for owner to accept.`;
          this.bookLoading   = false;
          this.bookingRideId = '';
        },
        error: (err) => {
          this.bookMessage = 'Booking failed: ' + (err.error || 'Unknown error');
          this.bookLoading  = false;
        }
      });
  }

  cancelBooking() {
    this.bookingRideId = '';
    this.bookMessage   = '';
  }
}