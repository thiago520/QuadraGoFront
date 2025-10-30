import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ACTIVITY_COLOR_MAP } from '../../../../utils/activity-color.map';
import { DashboardOverview, DashboardService, RecentActivityDto} from '../../../../core/services/dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, map, of, tap } from 'rxjs';

type TimeUnit = 'h' | 'd';

interface Movement {
  name: string;
  activity: string;
  time: number;
  timeUnit?: TimeUnit;
  color?: string;
}

// Helpers de tempo
function diffToTimeUnit(isoUtc: string): { time: number; unit: TimeUnit } {
  const now = Date.now();
  const at = Date.parse(isoUtc);
  const ms = Math.max(0, now - at);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours >= 24) return { time: Math.floor(hours / 24), unit: 'd' };
  return { time: Math.max(0, hours), unit: 'h' };
}

function colorByActivity(activity: string): string {
  const normalized = (activity || '').toLowerCase();
  for (const keyword in ACTIVITY_COLOR_MAP) {
    if (normalized.includes(keyword)) return ACTIVITY_COLOR_MAP[keyword];
  }
  return '#6b7280'; // cinza
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private api = inject(DashboardService);

  loadingOverview = signal(true);
  loadingActivities = signal(true);
  errorOverview = signal<string | null>(null);
  errorActivities = signal<string | null>(null);

  // overview
  private overview$ = this.api.getOverview().pipe(
    tap(() => this.errorOverview.set(null)),
    catchError(() => {
      this.errorOverview.set('Não foi possível carregar o resumo.');
      return of<DashboardOverview>({ students: 0, scheduledLessons: 0, activeSubscriptions: 0 });
    }),
    finalize(() => this.loadingOverview.set(false))
  );
  overview = toSignal(this.overview$, {
    initialValue: { students: 0, scheduledLessons: 0, activeSubscriptions: 0 },
  });

  // atividades
  private activities$ = this.api.getRecentActivities(20).pipe(
    tap(() => this.errorActivities.set(null)),
    map((items: RecentActivityDto[]) =>
      items
        .map((i) => {
          const t = diffToTimeUnit(i.happenedAt);
          return {
            name: i.name,
            activity: i.activity,
            time: t.time,
            timeUnit: t.unit,
            color: colorByActivity(i.activity),
          } as Movement;
        })
        .sort((a, b) => {
          const ah = a.timeUnit === 'd' ? a.time * 24 : a.time;
          const bh = b.timeUnit === 'd' ? b.time * 24 : b.time;
          return ah - bh;
        })
    ),
    catchError(() => {
      this.errorActivities.set('Não foi possível carregar as atividades.');
      return of<Movement[]>([]);
    }),
    finalize(() => this.loadingActivities.set(false))
  );
  lastMovements = toSignal(this.activities$, { initialValue: [] as Movement[] });

  ngOnInit(): void {}
}
