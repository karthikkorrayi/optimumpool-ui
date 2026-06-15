import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-dashboard.component.html'
})
export class CustomerDashboardComponent {
  constructor(public authService: AuthService) {}
}