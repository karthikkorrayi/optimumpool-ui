import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './owner-dashboard.component.html'
})
export class OwnerDashboardComponent implements OnInit {

  profile: any = null;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (data) => this.profile = data,
      error: () => {}
    });
  }
}