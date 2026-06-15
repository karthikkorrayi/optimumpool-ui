import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  username = '';
  password = '';
  error    = '';
  loading  = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error   = '';
    this.loading = true;

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          this.authService.saveSession(res.token, res.role);
          // Redirect based on role
          if (res.role === 'OWNER') {
            this.router.navigate(['/owner/dashboard']);
          } else {
            this.router.navigate(['/customer/dashboard']);
          }
        },
        error: () => {
          this.error   = 'Invalid username or password.';
          this.loading = false;
        }
      });
  }
}