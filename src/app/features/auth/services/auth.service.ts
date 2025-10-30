import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  LoginRequest,
  RefreshRequest,
  TokenPair,
} from '../../../core/models/auth.models';
import { UserSummary } from '../../../core/models/user.models';
import { TokenStorageService } from '../../../core/auth/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = environment.apiBaseUrl; // já inclui /api se houver
  private readonly user$ = new BehaviorSubject<UserSummary | null>(null);
  private refreshing = false;
  private refreshQueue: Array<() => void> = [];

  constructor(private http: HttpClient, private store: TokenStorageService) {
    // hidrata user no boot
    const meta = this.store.getUserMeta();
    if (meta.userId && meta.email) {
      this.user$.next({
        id: meta.userId,
        email: meta.email,
        roles: meta.roles || [],
      });
    }
  }

  get currentUser$() {
    return this.user$.asObservable();
  }
  get snapshotUser() {
    return this.user$.value;
  }

  login(data: LoginRequest) {
    return this.http.post<TokenPair>(`${this.base}/auth/login`, data).pipe(
      tap((res) => {
        this.store.setTokens(res);
        this.user$.next({ id: res.userId, email: res.email, roles: res.roles });
      })
    );
  }

  refresh(): Observable<TokenPair> {
    if (this.refreshing) {
      return new Observable<TokenPair>((obs) => {
        this.refreshQueue.push(() => obs.complete());
      });
    }
    const refreshToken = this.store.getRefreshToken();
    if (!refreshToken) return throwError(() => new Error('Sem refresh token'));

    this.refreshing = true;
    return this.http
      .post<TokenPair>(`${this.base}/auth/refresh`, {
        refreshToken,
      } satisfies RefreshRequest)
      .pipe(
        tap((tokens) => this.store.setTokens(tokens)),
        tap(() => {
          this.refreshing = false;
          this.refreshQueue.splice(0).forEach((fn) => fn());
        }),
        catchError((err) => {
          this.refreshing = false;
          this.logout();
          return throwError(() => err);
        })
      );
  }

  logout(body?: { refreshToken?: string }) {
    const hasAccess = !!this.store.getAccessToken();
    const req$ = hasAccess
      ? this.http.post<void>(`${this.base}/auth/logout`, body || {})
      : of(void 0);
    return req$.pipe(
      tap(() => {
        this.store.clear();
        this.user$.next(null);
      })
    );
  }
}
