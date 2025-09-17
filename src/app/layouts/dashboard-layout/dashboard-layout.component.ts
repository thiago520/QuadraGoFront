import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

type UserRole = 'teacher' | 'facility';

interface MenuItem {
  label: string;
  link?: string | any[];
  action?: 'logout';
}

interface HeaderModel {
  subtitle: string;
  menu: MenuItem[];
}

/** Mock temporário até termos Auth real */
class AuthFacadeMock {
  // troque entre 'teacher' e 'facility' para simular
  readonly role$ = new BehaviorSubject<UserRole>('teacher');

  logout() {
    console.log('Mock logout');
    localStorage.removeItem('token');
  }
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  subtitle = '';
  menu: MenuItem[] = [];

  private destroy$ = new Subject<void>();
  private auth = new AuthFacadeMock(); // usa mock

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.auth.role$
      .pipe(takeUntil(this.destroy$))
      .subscribe((role) => this.applyRole(role));
  }

  private applyRole(role: UserRole) {
    const model = this.buildHeaderByRole(role);
    this.subtitle = model.subtitle;
    this.menu = model.menu;
  }

  private buildHeaderByRole(role: UserRole): HeaderModel {
    if (role === 'teacher') {
      return {
        subtitle: 'Painel do Professor',
        menu: [
          { label: 'Painel', link: ['/dashboard'] },
          { label: 'Alunos', link: ['/dashboard/students'] },
          { label: 'Planos', link: ['/dashboard/plans'] },
          { label: 'Sair', action: 'logout' },
        ],
      };
    }

    return {
      subtitle: 'Painel da Quadra',
      menu: [
        { label: 'Painel', link: ['/dashboard'] },
        { label: 'Quadras', link: ['/dashboard/quadras'] },
        { label: 'Reservas', link: ['/dashboard/reservas'] },
        { label: 'Financeiro', link: ['/dashboard/financeiro'] },
        { label: 'Sair', action: 'logout' },
      ],
    };
  }

  onMenuClick(item: MenuItem) {
    if (item.action === 'logout') {
      this.logout();
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
