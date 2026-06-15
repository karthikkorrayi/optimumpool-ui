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

  // Invoice state per booking
  invoices: { [bookingId: string]: any } = {};
  payAmount: { [invoiceId: string]: number } = {};
  messages: { [bookingId: string]: string } = {};

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (data) => { this.bookings = data; this.loading = false; },
      error: () => { this.error = 'Could not load bookings.'; this.loading = false; }
    });
  }

  generateInvoice(bookingId: string) {
    this.messages[bookingId] = '';
    this.bookingService.generateInvoice(bookingId).subscribe({
      next: (invoice: any) => {
        this.invoices[bookingId]           = invoice;
        this.payAmount[invoice.invoiceId]  = invoice.bill_generated;
      },
      error: (err) => {
        this.messages[bookingId] = err.error || 'Invoice error. Is booking accepted?';
      }
    });
  }

  pay(bookingId: string, invoiceId: string) {
    const amount = this.payAmount[invoiceId];
    this.bookingService.payInvoice(invoiceId, amount).subscribe({
      next: (res: any) => {
        this.messages[bookingId] = res;
        this.load();   // refresh the list
      },
      error: () => {
        this.messages[bookingId] = 'Payment failed.';
      }
    });
  }
}