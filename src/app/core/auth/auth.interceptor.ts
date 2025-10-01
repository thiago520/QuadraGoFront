import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokenStorageService);
  const auth = inject(AuthService);

  const accessToken = tokens.getAccessToken();
  const cloned = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return auth.refresh().pipe(
          switchMap(() => {
            const token = tokens.getAccessToken();
            const retry = token
              ? cloned.clone({
                  setHeaders: { Authorization: `Bearer ${token}` },
                })
              : cloned;
            return next(retry);
          }),
          catchError((err) => {
            auth.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
