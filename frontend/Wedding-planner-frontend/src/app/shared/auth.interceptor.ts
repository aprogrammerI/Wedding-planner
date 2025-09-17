// import { HttpInterceptorFn } from '@angular/common/http';
//
// export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
//   // Get token from localStorage
//   const token = localStorage.getItem('auth_token');
//
//   if (token) {
//     // Clone the request and add the authorization header
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }
//
//   return next(req);
// };


// import { HttpInterceptorFn } from '@angular/common/http';
//
// export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('auth_token');
//   const userId = localStorage.getItem('user_id');
//
//   const headers: Record<string, string> = {};
//   if (token) headers['Authorization'] = `Bearer ${token}`;
//   if (userId) headers['X-User-Id'] = userId;
//
//   req = Object.keys(headers).length ? req.clone({ setHeaders: headers }) : req;
//   return next(req);
// };


// import { HttpInterceptorFn } from '@angular/common/http';
//
// export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('auth_token');
//   const userId = localStorage.getItem('user_id');
//
//   const setHeaders: Record<string, string> = {};
//   if (token) setHeaders['Authorization'] = `Bearer ${token}`;
//   if (userId) setHeaders['X-User-Id'] = userId;
//
//   const cloned = Object.keys(setHeaders).length ? req.clone({ setHeaders }) : req;
//   return next(cloned);
// };


import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('user_id');

  const setHeaders: Record<string, string> = {};
  if (token) setHeaders['Authorization'] = `Bearer ${token}`;
  if (userId) setHeaders['X-User-Id'] = userId;

  return Object.keys(setHeaders).length ? next(req.clone({ setHeaders })) : next(req);
};
