import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap, timeout } from 'rxjs';
import { BookingService } from '../../../core/services/booking.service';
import { OfferService } from '../../../core/services/offer.service';

@Component({
  selector: 'app-search-rides',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './search-rides.component.html',
})
export class SearchRidesComponent implements OnInit {
  from = '';
  to = '';
  date = '';
  rides: any[] = [];
  searched = false;
  loading = false;
  error = '';

  bookingRideId = '';
  seatsWanted = 1;
  bookMessage = '';
  bookError = '';
  bookLoading = false;

  constructor(
    private bookingService: BookingService,
    private offerService: OfferService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadAllRides();
  }

  private normalizedRoute() {
    return {
      from: this.from.trim(),
      to: this.to.trim(),
    };
  }


  loadAllRides() {
    this.loading = true;
    this.error = '';
    this.searched = false;
    this.bookingService
      .getAllRides()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => (this.rides = data || []),
        error: (err) => {
          this.error =
            err?.status === 401
              ? 'Session expired. Please login again.'
              : 'Could not load available rides. Confirm BookRide is running.';
        },
      });
  }

  clearFilters() {
    this.from = '';
    this.to = '';
    this.date = '';
    this.bookingRideId = '';
    this.bookMessage = '';
    this.bookError = '';
    this.loadAllRides();
  }

  search() {
    const route = this.normalizedRoute();

    if ((route.from && !route.to) || (!route.from && route.to)) {
      this.error = 'Enter both From and To cities, or clear both to browse all rides.';
      return;
    }

    this.error = '';
    this.rides = [];
    this.searched = false;
    this.loading = true;
    this.bookingRideId = '';
    this.bookMessage = '';
    this.bookError = '';

    // Try the documented OfferRide refresh first because it triggers RabbitMQ sync.
    // If that local service is slow/unavailable, continue to BookRide directly instead of leaving the UI stuck.
    this.offerService
      .getAllRides()
      .pipe(
        timeout(5000),
        catchError((syncError) => {
          console.warn('OfferRide refresh failed; searching BookRide directly:', syncError);
          return of([]);
        }),
        switchMap(() =>
          (route.from && route.to
            ? this.bookingService.filterRides(route.from, route.to)
            : this.bookingService.getAllRides()
          ).pipe(timeout(10000)),
        ),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          this.rides = this.date ? data.filter((ride) => ride.date === this.date) : data;
          this.searched = true;
        },
        error: (err) => {
          this.searched = true;
          this.error =
            err?.status === 401
              ? 'Session expired. Please login again.'
              : 'Search failed. Confirm BookRide is running on port 8084 and CORS allows this request.';
        },
      });
  }

  startBooking(rideId: string) {
    this.bookingRideId = rideId;
    this.bookMessage = '';
    this.bookError = '';
    this.seatsWanted = 1;
  }

  confirmBooking(rideId: string) {
    const route = this.normalizedRoute();

    this.bookMessage = '';
    this.bookError = '';
    this.bookLoading = true;

    this.bookingService
      .bookRide(rideId, this.seatsWanted, route.from, route.to)
      .pipe(
        switchMap((res: any) =>
          (route.from && route.to ? this.bookingService.filterRides(route.from, route.to) : this.bookingService.getAllRides()).pipe(
            timeout(10000),
            catchError((refreshError) => {
              console.warn('Booking succeeded, but ride refresh failed:', refreshError);
              return of(this.rides);
            }),
            switchMap((rides) => of({ res, rides })),
          ),
        ),
        finalize(() => {
          this.bookLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ res, rides }) => {
          this.bookMessage = `✓ Booked! ID: ${res.booking_id}. Waiting for owner to accept.`;
          this.bookingRideId = '';
          this.rides = rides;
        },
        error: (err) => {
          this.bookError = 'Booking failed: ' + (err?.error || 'Unknown error');
        },
      });
  }

  cancelBooking() {
    this.bookingRideId = '';
    this.bookMessage = '';
    this.bookError = '';
  }
}