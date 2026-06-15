import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-booking-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-requests.component.html',
})
export class BookingRequestsComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  error = '';
  message = '';

  constructor(
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.error = '';
    this.bookingService
      .getAllBookingsForOwner()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          this.bookings = data;
        },
        error: (err) => {
          this.error =
            'Failed to load bookings: ' +
            (err?.status === 401 ? 'Session expired, please login again.' : 'Server error.');
        },
      });
  }

  accept(bookingId: string) {
    this.message = '';
    this.bookingService.acceptBooking(bookingId).subscribe({
      next: () => {
        this.message = '✓ Booking accepted.';
        this.loadBookings();
      },
      error: (err) => {
        this.message = '✕ ' + (err?.error?.message || err?.error || 'Could not accept booking.');
      },
    });
  }

  reject(bookingId: string) {
    this.message = '';
    this.bookingService.rejectBooking(bookingId).subscribe({
      next: () => {
        this.message = 'Booking rejected.';
        this.loadBookings();
      },
      error: (err) => {
        this.message = '✕ ' + (err?.error?.message || err?.error || 'Could not reject booking.');
      },
    });
  }
}