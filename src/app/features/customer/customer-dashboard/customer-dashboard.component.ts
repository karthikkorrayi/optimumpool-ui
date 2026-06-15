import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './customer-dashboard.component.html'
})
export class CustomerDashboardComponent implements OnInit {

  profile: any = null;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (data) => this.profile = data,
      error: () => {}
    });
  }
}