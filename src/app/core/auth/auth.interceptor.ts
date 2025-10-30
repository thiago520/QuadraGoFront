// src/app/core/auth/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

function normalizeUrl(url: string): string {
  // remove origem absoluta, deixa só o path (p/ comparar com '/api/...'):
  try {
    const u = new URL(url, window.location.origin);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

/** Endpoints PUBLICOS: não recebem Authorization e não disparam refresh */
function isPublicRequest(url: string, method: string): boolean {
  const path = normalizeUrl(url);
  const api = environment.apiBaseUrl; // '/api'

  // fora da API também é "público" para o interceptor
  if (!path.startsWith(api)) return true;

  const login = `${api}/auth/login`;
  const refresh = `${api}/auth/refresh`;
  const signup = `${api}/users/person`;

  if (path.startsWith(login)) return true;
  if (path.startsWith(refresh)) return true;
  if (method === 'POST' && path === signup) return true;

  // Se quiser liberar GET público de perfil de professor:
  // if (method === 'GET' && path.startsWith(`${api}/profiles/teacher/`)) return true;

  return false;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokenStorageService);
  const auth = inject(AuthService);

  const publicReq = isPublicRequest(req.url, req.method);
  const access = tokens.getAccessToken();

  // NÃO anexar Authorization em públicos
  const reqToSend = (!publicReq && access)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${access}` } })
    : req;

  if (isDevMode()) {
    const path = normalizeUrl(req.url);
    // eslint-disable-next-line no-console
    console.debug('[HTTP]', req.method, path, {
      public: publicReq,
      withAuthHeader: reqToSend !== req
    });
  }

  return next(reqToSend).pipe(
    catchError((error: HttpErrorResponse) => {
      const triedWithToken = reqToSend !== req;
      const shouldTryRefresh =
        error.status === 401 && !publicReq && triedWithToken;

      if (!shouldTryRefresh) {
        if (isDevMode()) {
          // eslint-disable-next-line no-console
          console.debug('[HTTP][ERROR]', req.method, normalizeUrl(req.url), error);
        }
        return throwError(() => error);
      }

      if (isDevMode()) {
        // eslint-disable-next-line no-console
        console.debug('[AUTH] 401 com token → tentando refresh…');
      }

      // faz refresh (sem Authorization) e refaz a original com novo token
      return auth.refresh().pipe(
        switchMap(() => {
          const newAccess = tokens.getAccessToken();
          const retry = newAccess
            ? req.clone({ setHeaders: { Authorization: `Bearer ${newAccess}` } })
            : req;
          if (isDevMode()) {
            // eslint-disable-next-line no-console
            console.debug('[AUTH] refresh OK → refazendo', req.method, normalizeUrl(req.url));
          }
          return next(retry);
        }),
        catchError((err) => {
          if (isDevMode()) {
            // eslint-disable-next-line no-console
            console.debug('[AUTH] refresh FALHOU → logout', err);
          }
          auth.logout().subscribe({ error: () => {} });
          return throwError(() => err);
        })
      );
    })
  );
};
