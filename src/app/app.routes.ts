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
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./modules/core/pages/signup/signup.component').then(m => m.SignupComponent)
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
          import('./modules/teacher/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./modules/teacher/pages/students/students.component').then(m => m.StudentsComponent)
      },
      {
        path: 'students/new',
        loadComponent: () =>
          import('./modules/teacher/pages/studentNew/studentNew.component').then(m => m.StudentNewComponent)
      },
      {
        path: 'agenda',
        loadComponent: () =>
          import('./modules/teacher/pages/agenda/agenda.component').then(m => m.AgendaComponent)
      }
    ]
  }
];
