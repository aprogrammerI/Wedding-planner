
import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('user_id');

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['X-User-Id'] = userId;

  req = Object.keys(headers).length ? req.clone({ setHeaders: headers }) : req;
  return next(req);
};


