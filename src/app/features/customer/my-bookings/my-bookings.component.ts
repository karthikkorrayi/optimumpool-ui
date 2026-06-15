import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './my-bookings.component.html'
})
export class MyBookingsComponent implements OnInit {

  bookings: any[] = [];
  loading  = true;
  error    = '';

  invoices:  { [bookingId: string]: any }    = {};
  messages:  { [bookingId: string]: string } = {};
  invErrors: { [bookingId: string]: string } = {};

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error   = '';
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading  = false;
      },
      error: (err) => {
        this.error   = err?.status === 401
          ? 'Session expired. Please login again.'
          : 'Could not load bookings. Is BookRide service running?';
        this.loading = false;
      }
    });
  }

  generateInvoice(bookingId: string) {
    this.invErrors[bookingId] = '';
    this.messages[bookingId]  = '';

    this.bookingService.generateInvoice(bookingId).subscribe({
      next: (invoice: any) => {
        this.invoices[bookingId] = invoice;
      },
      error: (err) => {
        const msg = err?.error;
        this.invErrors[bookingId] = typeof msg === 'string'
          ? msg
          : 'Could not generate invoice. Is the booking accepted?';
      }
    });
  }

  pay(bookingId: string, invoiceId: string, amount: number) {
    this.messages[bookingId]  = '';
    this.invErrors[bookingId] = '';

    this.bookingService.payInvoice(invoiceId, amount).subscribe({
      next: (res: any) => {
        this.messages[bookingId] = typeof res === 'string' ? res : 'Payment successful!';
        delete this.invoices[bookingId];
        this.load();
      },
      error: (err) => {
        this.invErrors[bookingId] = 'Payment failed: ' + (err?.error || 'Unknown error');
      }
    });
  }
}