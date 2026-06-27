import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

@Component({
  selector: 'app-global-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, ProfileModalComponent],
  templateUrl: './global-navigation.component.html',
})
export class GlobalNavigationComponent implements OnInit, OnDestroy {
  profile: any = null;
  profileOpen = false;
  currentUrl = '';

  // teardown notifier
  private destroy$ = new Subject<void>();

  constructor(public authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.currentUrl = this.router.url;

    // react to navigation end and load profile when appropriate
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((e: any) => e.urlAfterRedirects),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((url: string) => {
        this.currentUrl = url;
        if (this.authService.isLoggedIn() && this.showNav) {
          this.loadProfile();
        }
        this.cdr.detectChanges();
      });

    // react to login/logout changes
    this.authService.loggedIn$.pipe(takeUntil(this.destroy$)).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.loadProfile();
      } else {
        this.profile = null;
        this.profileOpen = false;
      }
      this.cdr.detectChanges();
    });

    if (this.authService.isLoggedIn()) {
      this.loadProfile();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get showNav() { return this.authService.isLoggedIn() && !['/login', '/register'].includes(this.currentUrl); }
  get role() { return this.authService.getRole(); }
  get displayName() { return this.profile?.fullName || this.profile?.name || this.profile?.username || 'My Profile'; }

  // reset profile first so UI updates immediately and then fetch
  loadProfile() {
    this.profile = null;
    this.cdr.detectChanges();
    this.authService.getProfile().pipe(takeUntil(this.destroy$)).subscribe({
      next: (p) => { this.profile = p; this.cdr.detectChanges(); },
      error: (err) => {
        console.warn('Failed to load profile', err);
        this.profile = null;
        this.cdr.detectChanges();
      },
    });
  }
  logout() { this.profileOpen = false; this.authService.logout(); }
}