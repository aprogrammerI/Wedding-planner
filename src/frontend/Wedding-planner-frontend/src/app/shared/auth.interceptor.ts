


import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('user_id');

  const setHeaders: Record<string, string> = {};
  if (token) setHeaders['Authorization'] = `Bearer ${token}`;
  if (userId) setHeaders['X-User-Id'] = userId;

  return Object.keys(setHeaders).length ? next(req.clone({ setHeaders })) : next(req);
};
