import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  CreateStudentDTO,
  UpdateStudentDTO,
} from '../../../core/models/user.models';

import { Observable } from 'rxjs';
import { Student } from '../../../core/models/user.models';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private http = inject(HttpClient);
  private base = `${environment.API_URL}/students`;

  list(): Observable<Student[]> {
    return this.http.get<Student[]>(this.base);
  }
  get(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.base}/${id}`);
  }
  create(body: CreateStudentDTO): Observable<Student> {
    return this.http.post<Student>(this.base, body);
  }
  update(id: number, body: UpdateStudentDTO): Observable<Student> {
    return this.http.put<Student>(`${this.base}/${id}`, body);
  }
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
