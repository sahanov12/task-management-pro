import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';
 
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token(); // assumes token is exposed as a signal, e.g. token = signal<string | null>(...)
 
  // Only attach the token to your own API calls, not to any third-party requests
  const isApiUrl = req.url.startsWith('http://localhost:7071') || req.url.includes('/api/');
 
  if (token && isApiUrl) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
 
  return next(req);
};