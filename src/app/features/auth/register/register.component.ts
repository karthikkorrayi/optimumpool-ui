import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  username = '';
  password = '';
  role     = 'CUSTOMER';
  phone    = 0;
  error    = '';
  success  = '';
  loading  = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Username and password are required.';
      return;
    }
    if (this.phone <= 0) {
      this.error = 'Please enter a valid phone number.';
      return;
    }

    this.error   = '';
    this.success = '';
    this.loading = true;

    this.authService.register({
      username: this.username,
      password: this.password,
      role:     this.role,
      phone:    this.phone
    }).subscribe({
      next: () => {
        this.success = 'Account created! Redirecting to login...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err.status === 409
          ? 'Username already taken. Try another.'
          : 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}