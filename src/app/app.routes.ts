import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { LoginComponent }           from './features/auth/login/login.component';
import { RegisterComponent }        from './features/auth/register/register.component';
import { OwnerDashboardComponent }  from './features/owner/owner-dashboard/owner-dashboard.component';
import { CreateRideComponent }      from './features/owner/create-ride/create-ride.component';
import { BookingRequestsComponent } from './features/owner/booking-requests/booking-requests.component';
import { CustomerDashboardComponent } from './features/customer/customer-dashboard/customer-dashboard.component';
import { SearchRidesComponent }     from './features/customer/search-rides/search-rides.component';
import { MyBookingsComponent }      from './features/customer/my-bookings/my-bookings.component';

export const routes: Routes = [
  { path: '',           redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',      component: LoginComponent },
  { path: 'register',   component: RegisterComponent },

  // Owner pages — only accessible when logged in (authGuard checks this)
  { path: 'owner/dashboard',         component: OwnerDashboardComponent,  canActivate: [authGuard] },
  { path: 'owner/create-ride',       component: CreateRideComponent,       canActivate: [authGuard] },
  { path: 'owner/booking-requests',  component: BookingRequestsComponent,  canActivate: [authGuard] },

  // Customer pages
  { path: 'customer/dashboard',      component: CustomerDashboardComponent, canActivate: [authGuard] },
  { path: 'customer/search',         component: SearchRidesComponent,       canActivate: [authGuard] },
  { path: 'customer/my-bookings',    component: MyBookingsComponent,        canActivate: [authGuard] },

  // Catch-all — redirect unknown URLs to login
  { path: '**', redirectTo: 'login' }
];