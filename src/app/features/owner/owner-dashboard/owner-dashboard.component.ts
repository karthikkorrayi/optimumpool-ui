import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './owner-dashboard.component.html'
})
export class OwnerDashboardComponent {
  constructor(public authService: AuthService) {}
}