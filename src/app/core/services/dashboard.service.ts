// src/app/features/dashboard/dashboard.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface DashboardOverview {
  students: number;          // total de alunos do professor
  scheduledLessons: number;  // aulas agendadas (próximas)
  activeSubscriptions: number; // assinaturas ativas
}

export interface RecentActivityDto {
  name: string;       // Nome do aluno/entidade
  activity: string;   // Ex.: "Nova matrícula", "Pagamento realizado"
  happenedAt: string; // ISO UTC (ex.: "2025-10-29T00:35:00Z")
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  getOverview(): Observable<DashboardOverview> {
    return this.http.get<DashboardOverview>(`${this.base}/dashboard/overview`);
  }

  getRecentActivities(limit = 10): Observable<RecentActivityDto[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<RecentActivityDto[]>(`${this.base}/dashboard/activities`, { params });
  }
}
