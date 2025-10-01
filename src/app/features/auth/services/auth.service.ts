import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/auth/token-storage.service';
import {
  LoginRequest,
  LoginResponse,
  TokenPair,
  UserSummary,
} from '../../../core/models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiBaseUrl}`;
  private readonly user$ = new BehaviorSubject<UserSummary | null>(null);
  private refreshing = false;
  private refreshQueue: Array<() => void> = [];

  constructor(private http: HttpClient, private store: TokenStorageService) {}

  get currentUser$(): Observable<UserSummary | null> {
    return this.user$.asObservable();
  }
  get snapshotUser(): UserSummary | null {
    return this.user$.value;
  }

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, data).pipe(
      tap((res) => {
        this.store.setTokens(res.accessToken, res.refreshToken);
        this.user$.next(res.user);
      })
    );
  }

  loadMe() {
    return this.http
      .get<UserSummary>(`${this.base}/auth/me`)
      .pipe(tap((u) => this.user$.next(u)));
  }

  logout() {
    this.store.clear();
    this.user$.next(null);
  }

  refresh(): Observable<TokenPair> {
    if (this.refreshing) {
      return new Observable<TokenPair>((observer) => {
        this.refreshQueue.push(() => observer.complete());
      });
    }

    const refreshToken = this.store.getRefreshToken();
    if (!refreshToken) return throwError(() => new Error('Sem refresh token'));

    this.refreshing = true;
    return this.http
      .post<TokenPair>(`${this.base}/auth/refresh`, { refreshToken })
      .pipe(
        tap((tokens) =>
          this.store.setTokens(tokens.accessToken, tokens.refreshToken)
        ),
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
}
