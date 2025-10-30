import { Injectable } from '@angular/core';


const KEY = 'qg_auth_v2';


export interface StoredAuth {
accessToken: string | null;
refreshToken: string | null;
userId: number | null;
email: string | null;
roles: string[];
}


@Injectable({ providedIn: 'root' })
export class TokenStorageService {
get value(): StoredAuth {
try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
catch { return { accessToken: null, refreshToken: null, userId: null, email: null, roles: [] }; }
}


set value(v: StoredAuth) { localStorage.setItem(KEY, JSON.stringify(v)); }


setTokens(resp: { accessToken: string; refreshToken: string; userId: number; email: string; roles: string[]; }) {
this.value = { accessToken: resp.accessToken, refreshToken: resp.refreshToken, userId: resp.userId, email: resp.email, roles: resp.roles };
}


clear() { localStorage.removeItem(KEY); }


getAccessToken() { return this.value.accessToken || null; }
getRefreshToken() { return this.value.refreshToken || null; }
getUserMeta() { const { userId, email, roles } = this.value; return { userId, email, roles }; }
}
