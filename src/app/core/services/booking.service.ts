import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {

  private base = environment.bookingApi;

  constructor(private http: HttpClient) {}

  // ─── Rides (Customer sees these) ─────────────────────────────

  getAllRides() {
    return this.http.get<any[]>(`${this.base}/bookrides`);
  }

  filterRides(from: string, to: string) {
    return this.http.get<any[]>(`${this.base}/bookrides/filter/${from}/${to}`);
  }

  getFareDetails(from: string, to: string) {
    return this.http.get<any[]>(`${this.base}/rides/details/${from}/${to}`);
  }

  // ─── Booking ──────────────────────────────────────────────────

  bookRide(rideId: string, seats: number, from: string, to: string) {
    return this.http.post(`${this.base}/bookrides/${rideId}`, { seats, from, to });
  }

  getMyBookings() {
    return this.http.get<any[]>(`${this.base}/booking/me`);
  }

  // ─── Owner Accept / Reject ───────────────────────────────────

  getPendingBookings() {
    return this.http.get<any[]>(`${this.base}/booking/owner/pending`);
  }

  getAllBookingsForOwner() {
    return this.http.get<any[]>(`${this.base}/booking/owner/all`);
  }

  acceptBooking(bookingId: string) {
    return this.http.put(`${this.base}/booking/accept/${bookingId}`, {});
  }

  rejectBooking(bookingId: string) {
    return this.http.put(`${this.base}/booking/reject/${bookingId}`, {});
  }

  // ─── Invoice ─────────────────────────────────────────────────

  generateInvoice(bookingId: string) {
    return this.http.post(`${this.base}/invoice/${bookingId}`, {});
  }

  payInvoice(invoiceId: string, amount: number) {
    return this.http.post(`${this.base}/invoice/pay/${invoiceId}`, { amount });
  }
}