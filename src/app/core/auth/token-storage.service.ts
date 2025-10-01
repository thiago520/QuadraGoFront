import { Injectable } from '@angular/core';


const KEY = 'qg_auth';


export interface StoredTokens {
accessToken: string | null;
refreshToken: string | null;
}


@Injectable({ providedIn: 'root' })
export class TokenStorageService {
get tokens(): StoredTokens {
try {
return JSON.parse(localStorage.getItem(KEY) || '{}');
} catch {
return { accessToken: null, refreshToken: null };
}
}


set tokens(v: StoredTokens) {
localStorage.setItem(KEY, JSON.stringify(v));
}


setTokens(accessToken: string, refreshToken: string) {
this.tokens = { accessToken, refreshToken };
}


clear() {
localStorage.removeItem(KEY);
}


getAccessToken(): string | null { return this.tokens.accessToken || null; }
getRefreshToken(): string | null { return this.tokens.refreshToken || null; }
}
