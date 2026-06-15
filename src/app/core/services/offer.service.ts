import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private base = environment.offerApi;

  constructor(private http: HttpClient) {}

  // Owner creates a new ride offer
  createRide(rideData: any) {
    return this.http.post(`${this.base}/offerride`, rideData, {
      observe: 'response',
      responseType: 'text',
    });
  }

  // Get all rides AND trigger RabbitMQ sync to BookRide
  getAllRides() {
    return this.http.get<any[]>(`${this.base}/offerride`);
  }

  // Owner sees only their rides
  getMyRides() {
    return this.http.get<any[]>(`${this.base}/offerride/mine`);
  }

  // Owner sees all bookings with customer details (from OfferRide side)
  getMyBookings() {
    return this.http.get<any[]>(`${this.base}/offerride/bookings`);
  }

  // Owner updates a ride
  updateRide(id: string, rideData: any) {
    return this.http.put(`${this.base}/offerride/${id}`, rideData);
  }
}