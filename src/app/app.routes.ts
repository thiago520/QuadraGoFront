import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/core/pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./modules/core/pages/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/core/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'alunos',
        loadComponent: () =>
          import('./modules/professor/pages/alunos/alunos.component').then(m => m.AlunosComponent)
      },
      {
        path: 'agenda',
        loadComponent: () =>
          import('./modules/professor/pages/agenda/agenda.component').then(m => m.AgendaComponent)
      }
    ]
  }
];
