import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'professor/alunos',
    loadComponent: () =>
      import('./modules/professor/pages/alunos/alunos.component').then(m => m.AlunosComponent),
  },
  {
    path: 'professor/assinaturas',
    loadComponent: () =>
      import('./modules/professor/pages/assinaturas/assinaturas.component').then(m => m.AssinaturasComponent),
  },
  {
    path: 'professor/agenda',
    loadComponent: () =>
      import('./modules/professor/pages/agenda/agenda.component').then(m => m.AgendaComponent),
  },
  {
    path: '',
    redirectTo: 'professor/alunos',
    pathMatch: 'full'
  }
];

