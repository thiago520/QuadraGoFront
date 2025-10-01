import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PlanFormComponent } from '../plan-form/plan-form.component';

type Period = 'Mensal' | 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual';
const GRID_SIZE = 4;

interface Plan {
  id: number;
  name: string;
  icon: string;
  price: number;
  period: Period;
  features: string[];
  subscriptionsCount?: number;
  popular?: boolean;
  emphasized?: boolean;
  isPlaceholder?: boolean;
}

type PlanFromApi = {
  id: number;
  name: string;
  icon: string;
  price: number;
  /** Ideal: API já devolver neste formato */
  period: Period;
  features: string[];
  subscriptionsCount: number;
};

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  plans: Plan[] = [];

  constructor(private dialog: MatDialog) {}

  trackByPlan = (_: number, p: Plan) => p.id ?? p.name;

  ngOnInit(): void {
    // MOCK — troque por HttpClient. Já usando Period unificado.
    const apiMock: PlanFromApi[] = [
      {
        id: 1,
        name: 'Básico',
        icon: 'group',
        price: 29.9,
        period: 'Trimestral',
        features: [
          'Até 50 alunos',
          'Agendamento básico',
          'Relatórios simples',
          'Suporte por email',
        ],
        subscriptionsCount: 42,
      },
      {
        id: 2,
        name: 'Profissional',
        icon: 'emoji_events',
        price: 59.9,
        period: 'Mensal',
        features: [
          'Até 200 alunos',
          'Agendamento avançado',
          'Relatórios detalhados',
          'Pagamentos integrados',
          'Suporte prioritário',
        ],
        subscriptionsCount: 87,
      },
    ];
    this.hydrateFromApi(apiMock);
  }

  private hydrateFromApi(data: PlanFromApi[] | null | undefined): void {
    if (!data || data.length === 0) {
      this.plans = this.buildPlaceholders(GRID_SIZE);
      return;
    }

    const mapped: Plan[] = data.slice(0, GRID_SIZE).map((p) => ({
      id: p.id,
      name: p.name,
      icon: p.icon,
      price: p.price,
      period: p.period, // já é Period do form
      features: p.features ?? [],
      subscriptionsCount: p.subscriptionsCount ?? 0,
      emphasized: false,
      popular: false,
      isPlaceholder: false,
    }));

    const withPopular = this.applyPopularAndEmphasis(mapped);
    const missing = GRID_SIZE - withPopular.length;
    this.plans =
      missing > 0
        ? [...withPopular, ...this.buildPlaceholders(missing)]
        : withPopular;
  }

  private applyPopularAndEmphasis(plans: Plan[]): Plan[] {
    if (!plans.length) return plans;
    const max = Math.max(...plans.map((p) => p.subscriptionsCount ?? 0));
    let marked = false;
    return plans.map((p) => {
      const isTop = !marked && (p.subscriptionsCount ?? 0) === max;
      if (isTop) marked = true;
      return { ...p, popular: isTop, emphasized: isTop };
    });
  }

  private buildPlaceholders(n: number): Plan[] {
    return Array.from({ length: n }, (_, i) => ({
      id: 1000 + i,
      name: 'Criar Novo Plano',
      icon: 'add',
      price: 0,
      period: 'Mensal', // default qualquer; não é exibido no placeholder
      features: [],
      subscriptionsCount: 0,
      popular: false,
      emphasized: false,
      isPlaceholder: true,
    }));
  }

  // ===== Helpers de UI =====
  periodSuffix(period: Period): string {
    switch (period) {
      case 'Mensal':
        return 'mês';
      case 'Bimestral':
        return 'bimestre';
      case 'Trimestral':
        return 'trimestre';
      case 'Semestral':
        return 'semestre';
      case 'Anual':
        return 'ano';
    }
  }

  // ====== DIALOGS ======
  openCreateDialog() {
    const dialogRef = this.dialog.open(PlanFormComponent, {
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'plan-form-dialog',
      data: null, // criação
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // TODO: chamar API para criar e refazer a lista
        console.log('CREATE PLAN result', result);
        // this.reload();
      }
    });
  }

  openEditDialog(plan: Plan) {
    if (plan.isPlaceholder) {
      this.openCreateDialog();
      return;
    }

    const dialogRef = this.dialog.open(PlanFormComponent, {
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'plan-form-dialog',
      data: {
        id: plan.id,
        icon: plan.icon,
        title: plan.name,
        price: plan.price,
        period: plan.period, // já é Period do form
        features: plan.features,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // TODO: chamar API de update e refazer a lista
        console.log('EDIT PLAN result', result);
        // this.reload();
      }
    });
  }

  openTalkToTeacher() {
    console.log('Falar com Professor');
    // window.open('https://wa.me/55XXXXXXXXXXX', '_blank');
  }
}
