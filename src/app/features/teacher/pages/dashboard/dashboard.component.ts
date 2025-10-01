import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ACTIVITY_COLOR_MAP } from '../../../../utils/activity-color.map';

type TimeUnit = 'h' | 'd';

interface Movement {
  name: string;
  activity: string;
  time: number;
  timeUnit?: TimeUnit;
  color?: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  lastMovements: Movement[] = [];

  ngOnInit(): void {
    // Simulação de resposta da API (sem color)
    const apiData: Omit<Movement, 'color'>[] = [
      { name: 'Maria Silva', activity: 'Nova matrícula',      time: 2, timeUnit: 'h' },
      { name: 'João Santos', activity: 'Aula cancelada',      time: 4, timeUnit: 'h' },
      { name: 'Ana Costa',   activity: 'Pagamento realizado', time: 6, timeUnit: 'h' },
      { name: 'Pedro Lima',  activity: 'Aula reagendada',     time: 1, timeUnit: 'd' },
    ];

    // Aplica cor automaticamente
    this.lastMovements = apiData.map(m => ({
      ...m,
      color: this.getColorByActivity(m.activity),
    }));

    // Ordena do menor tempo para o maior
    this.lastMovements.sort((a, b) => this.totalHours(a) - this.totalHours(b));
  }

  /** Converte tempo para horas */
  private totalHours(m: Movement): number {
    return (m.timeUnit === 'd' ? m.time * 24 : m.time);
  }

  /** Busca a cor conforme palavras-chave (case-insensitive, parciais) */
  private getColorByActivity(activity: string): string {
    const normalized = activity.toLowerCase();

    for (const keyword in ACTIVITY_COLOR_MAP) {
      if (normalized.includes(keyword)) {
        return ACTIVITY_COLOR_MAP[keyword];
      }
    }

    return '#6b7280'; // fallback cinza
  }
}
