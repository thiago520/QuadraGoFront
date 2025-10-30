import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  signupPerson(body: {
    name: string;
    cpf: string;
    phone: string;
    birthDate: string;
    email: string;
    password: string;
    roles?: string[];
  }) {
    return this.http.post<{ id: number; email: string; name: string }>(
      `${this.base}/users/person`,
      body
    );
  }

  getById(userId: number) {
    return this.http.get(`${this.base}/users/${userId}`);
  }
  list() {
    return this.http.get(`${this.base}/users`);
  }
  updateEmail(userId: number, email: string) {
    return this.http.put(`${this.base}/users/${userId}/email`, { email });
  }
  updatePassword(userId: number, password: string) {
    return this.http.put(`${this.base}/users/${userId}/password`, { password });
  }
  updateStatus(userId: number, status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED') {
    return this.http.put(`${this.base}/users/${userId}/status`, { status });
  }
  updatePerson(
    userId: number,
    body: { name?: string; cpf?: string; phone?: string; birthDate?: string }
  ) {
    return this.http.put(`${this.base}/users/${userId}/person`, body);
  }
  rolesAdd(userId: number, roles: string[]) {
    return this.http.put(`${this.base}/users/${userId}/roles/add`, { roles });
  }
  rolesRemove(userId: number, roles: string[]) {
    return this.http.put(`${this.base}/users/${userId}/roles/remove`, {
      roles,
    });
  }
  rolesReplace(userId: number, roles: string[]) {
    return this.http.put(`${this.base}/users/${userId}/roles/replace`, {
      roles,
    });
  }
  delete(userId: number) {
    return this.http.delete(`${this.base}/users/${userId}`);
  }
}
