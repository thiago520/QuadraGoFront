import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

type BillingPeriod = 'mês' | 'ano';
const GRID_SIZE = 4;

interface Plan {
  id: number;
  name: string;
  icon: string; // nome do mat-icon
  price: number; // em BRL
  period: BillingPeriod;
  features: string[];
  subscriptionsCount?: number; // usado para Popular
  popular?: boolean; // badge
  emphasized?: boolean; // borda azul
  isPlaceholder?: boolean; // vira "Criar novo plano"
}

type PlanFromApi = {
  id: number;
  name: string;
  icon: string;
  price: number;
  period: 'mês' | 'ano';
  features: string[];
  subscriptionsCount: number;
  emphasized?: boolean;
};

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  plans: Plan[] = [];

  ngOnInit(): void {
    // Troque pelo HttpClient real:
    // this.http.get<PlanFromApi[]>('/api/teacher/plans').subscribe(res => this.hydrateFromApi(res));

    // MOCK: altere para testar
    const apiMock: PlanFromApi[] = [
      // experimente [] ou 1..3 itens
      {
        id: 1,
        name: 'Básico',
        icon: 'group',
        price: 29.9,
        period: 'mês',
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
        period: 'mês',
        features: [
          'Até 200 alunos',
          'Agendamento avançado',
          'Relatórios detalhados',
          'Pagamentos integrados',
          'Suporte prioritário',
        ],
        subscriptionsCount: 87,
      },
      {
        id: 2,
        name: 'Profissional',
        icon: 'emoji_events',
        price: 99.9,
        period: 'mês',
        features: [
          'Até 200 alunos',
          'Agendamento avançado',
          'Relatórios detalhados',
          'Pagamentos integrados',
          'Suporte prioritário',
        ],
        subscriptionsCount: 85,
      },
    ];
    this.hydrateFromApi(apiMock);
  }

  /** Preenche estado a partir do retorno de API garantindo sempre 4 cards */
  private hydrateFromApi(data: PlanFromApi[] | null | undefined): void {
    if (!data || data.length === 0) {
      this.plans = this.buildPlaceholders(GRID_SIZE);
      return;
    }

    // 1) mapeia e limita aos 4 primeiros
    const mapped: Plan[] = data.slice(0, GRID_SIZE).map((p) => ({
      id: p.id,
      name: p.name,
      icon: p.icon,
      price: p.price,
      period: p.period,
      features: p.features ?? [],
      subscriptionsCount: p.subscriptionsCount ?? 0,
      // emphasized populado pelo "popular" depois
      emphasized: false,
      popular: false,
      isPlaceholder: false,
    }));

    // 2) aplica Popular + borda azul no plano com mais assinaturas
    const withPopular = this.applyPopularAndEmphasis(mapped);

    // 3) completa com placeholders até totalizar 4
    const missing = GRID_SIZE - withPopular.length;
    this.plans =
      missing > 0
        ? [...withPopular, ...this.buildPlaceholders(missing)]
        : withPopular;
  }

  /** Marca 'popular' e 'emphasized' no plano com maior subscriptionsCount (desempate: primeiro) */
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

  /** Gera N placeholders para "Criar novo plano" */
  private buildPlaceholders(n: number): Plan[] {
    return Array.from({ length: n }, (_, i) => ({
      id: 1000 + i,
      name: 'Criar Novo Plano',
      icon: 'add',
      price: 0,
      period: 'mês',
      features: [],
      subscriptionsCount: 0,
      popular: false,
      emphasized: false,
      isPlaceholder: true,
    }));
  }

  // Ações
  choose(plan: Plan) {
    if (plan.isPlaceholder) {
      this.createNewPlan();
      return;
    }
    console.log('Escolheu plano:', plan);
    // this.router.navigate(['/dashboard/planos', plan.id, 'checkout']);
  }

  createNewPlan() {
    console.log('Criar novo plano');
    // this.router.navigate(['/dashboard/planos/novo']);
  }

  talkToTeacher() {
    console.log('Falar com Professor');
    // window.open('https://wa.me/5544991010353', '_blank');
  }
}
