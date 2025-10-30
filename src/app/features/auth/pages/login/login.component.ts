import { Component, signal, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginRequest } from '../../../../core/models/auth.models';

// Tipos do auth (garante payload correto)


@Component({
  standalone: true,
  selector: 'qg-login',
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Restaura preferências do usuário (lembrar e-mail)
  private restoreRememberEmail() {
    const remembered = localStorage.getItem('qg_remember_email') === '1';
    const email = remembered ? (localStorage.getItem('qg_last_email') || '') : '';
    return { remembered, email };
  }

  // Forms tipados e não-nuláveis
  form = this.fb.nonNullable.group({
    email: [
      this.restoreRememberEmail().email,
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    rememberMe: [this.restoreRememberEmail().remembered],
  });

  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password, rememberMe } = this.form.getRawValue();
    const payload: LoginRequest = { email, password };

    this.auth.login(payload).subscribe({
      next: () => {
        // Persistência opcional do e-mail
        if (rememberMe) {
          localStorage.setItem('qg_remember_email', '1');
          localStorage.setItem('qg_last_email', email);
        } else {
          localStorage.removeItem('qg_remember_email');
          localStorage.removeItem('qg_last_email');
        }

        this.router.navigateByUrl('/dashboard');
        this.loading.set(false);
      },
      error: (e) => {
        // Mensagem do backend (quando houver), fallback genérico
        const apiMsg =
          e?.error?.details?.fields?.[0]?.message ||
          e?.error?.message ||
          'Credenciais inválidas';
        this.error.set(apiMsg);
        this.loading.set(false);
      },
    });
  }
}
