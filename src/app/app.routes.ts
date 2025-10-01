import { Routes } from '@angular/router';
// Layouts (standalone)
import { PublicLayoutComponent } from './features/public/pages/public-layout/public-layout.component';
import { DashboardLayoutComponent } from './features/public/pages/dashboard-layout/dashboard-layout.component';

// (Opcional) guard por papel
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  // --- Público ---
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/pages/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/pages/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
    ],
  },

  // --- Área logada (Dashboard) ---
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    // Protege todo o bloco do dashboard (opcional):
    // canActivate: [roleGuard(['ADMIN', 'TEACHER', 'STUDENT'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/teacher/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'plans',
        loadComponent: () =>
          import('./features/teacher/pages/plans/plans.component').then(
            (m) => m.PlansComponent
          ),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./features/teacher/pages/schedule/schedule.component').then(
            (m) => m.ScheduleComponent
          ),
      },

      // ---- Students feature ----
      {
        path: 'students',
        // Se quiser restringir apenas para ADMIN/TEACHER:
        // canActivate: [roleGuard(['ADMIN', 'TEACHER'])],
        loadComponent: () =>
          import('./features/students/pages/students/students.component').then(
            (m) => m.StudentsComponent
          ),
      },
      {
        path: 'students/new',
        // canActivate: [roleGuard(['ADMIN', 'TEACHER'])],
        loadComponent: () =>
          import(
            './features/students/pages/student-form/student-form.component'
          ).then((m) => m.StudentFormComponent),
      },
      {
        path: 'students/:id/edit',
        // canActivate: [roleGuard(['ADMIN', 'TEACHER'])],
        loadComponent: () =>
          import(
            './features/students/pages/student-form/student-form.component'
          ).then((m) => m.StudentFormComponent),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
