import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    RouterModule
],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {

  constructor(private router: Router) {}

  logout() {
    // Lógica de logout (ex.: limpar sessão, redirecionar para login)
    this.router.navigate(['/login']);
    // Aqui você pode adicionar a lógica para limpar tokens ou sessões, se aplicável
  }

}
