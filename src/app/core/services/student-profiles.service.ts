import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentProfilesService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  create(userId: number, body: { emergencyContact?: string; notes?: string }) {
    return this.http.post(`${this.base}/profiles/${userId}/student`, body);
  }
  get(userId: number) {
    return this.http.get(`${this.base}/profiles/student/${userId}`);
  }
  update(userId: number, body: { emergencyContact?: string; notes?: string }) {
    return this.http.put(`${this.base}/profiles/student/${userId}`, body);
  }
  delete(userId: number) {
    return this.http.delete(`${this.base}/profiles/${userId}/student`);
  }
}
