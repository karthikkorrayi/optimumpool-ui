import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Read the token from localStorage (saved there after login)
  const token = localStorage.getItem('token');

  if (token) {
    // Clone the request and add the Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // No token — send the request as-is (login and register don't need it)
  return next(req);
};