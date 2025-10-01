import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'qg-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Campos do formulário (sem ngModel)
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    // Se seu backend espera 'username', mapeie o email para username aqui:
    const { email, password } = this.form.value;
    const payload = { username: email as string, password: password as string };

    this.auth.login(payload as any).subscribe({
      next: () => this.router.navigateByUrl('/professor'),
      error: () => {
        this.error.set('Credenciais inválidas');
        this.loading.set(false);
      },
    });
  }
}
