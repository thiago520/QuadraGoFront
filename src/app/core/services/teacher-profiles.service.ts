import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TeacherProfilesService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  create(
    userId: number,
    body: { bio?: string; hourlyRate?: number; specialties?: string[] }
  ) {
    return this.http.post(`${this.base}/profiles/${userId}/teacher`, body);
  }
  get(userId: number) {
    return this.http.get(`${this.base}/profiles/teacher/${userId}`);
  }
  update(
    userId: number,
    body: { bio?: string; hourlyRate?: number; specialties?: string[] }
  ) {
    return this.http.put(`${this.base}/profiles/teacher/${userId}`, body);
  }
  specialtiesAdd(userId: number, list: string[]) {
    return this.http.put(
      `${this.base}/profiles/teacher/${userId}/specialties/add`,
      list
    );
  }
  specialtiesRemove(userId: number, list: string[]) {
    return this.http.put(
      `${this.base}/profiles/teacher/${userId}/specialties/remove`,
      list
    );
  }
  specialtiesReplace(userId: number, list: string[]) {
    return this.http.put(
      `${this.base}/profiles/teacher/${userId}/specialties/replace`,
      list
    );
  }
  delete(userId: number) {
    return this.http.delete(`${this.base}/profiles/${userId}/teacher`);
  }
}
