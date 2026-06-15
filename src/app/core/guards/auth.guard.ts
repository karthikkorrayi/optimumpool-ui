import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token  = localStorage.getItem('token');

  if (token) {
    return true;   // logged in — let them through
  }

  // Not logged in — send to login page
  router.navigate(['/login']);
  return false;
};