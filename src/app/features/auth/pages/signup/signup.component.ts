import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

// Services
import { UsersService } from '../../../../core/services/users.service';

// Validadores & Máscaras
import { cnpjValidator, cpfValidator, notFutureDate, phoneValidator } from '../../../../shared/validators/br-validators';
import { CnpjMaskDirective, CpfMaskDirective } from '../../../../shared/directives/cpf-cnpj-mask.directive';
import { PhoneMaskDirective } from '../../../../shared/directives/phone-mask.directive';

type SignupRoleOption = 'professor' | 'quadra';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Material
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    // Máscaras
    CpfMaskDirective,
    CnpjMaskDirective,
    PhoneMaskDirective,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private users = inject(UsersService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  passwordVisible = signal(false);

  readonly options: { value: SignupRoleOption; viewValue: string; disabled?: boolean }[] = [
    { value: 'professor', viewValue: 'Para Professores' },
    { value: 'quadra', viewValue: 'Para Quadras Esportivas', disabled: true }, // desabilitado por enquanto
  ];

  form = this.fb.nonNullable.group({
    selectedOption: <SignupRoleOption>'professor',

    // PF
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, cpfValidator()]],
    telefone: ['', [Validators.required, phoneValidator('mobile')]],
    birthDate: ['', [Validators.required, notFutureDate()]],

    // PJ (pré, mas ainda inativo)
    razaoSocial: ['', []],
    cnpj: ['', [cnpjValidator()]],
    nomeResponsavel: ['', []],
    telefoneComercial: ['', [phoneValidator('any')]],

    // Comuns
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  c = (name: keyof typeof this.form.controls) => this.form.controls[name];

  isProfessor() { return this.form.controls.selectedOption.value === 'professor'; }
  isQuadra() { return this.form.controls.selectedOption.value === 'quadra'; }

  togglePasswordVisibility() { this.passwordVisible.update(v => !v); }

  private toYYYYMMDD(value: string): string {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  }

  private digitsOnly(s: string) { return (s ?? '').replace(/\D/g, ''); }

  onSubmit() {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();

    if (this.isProfessor()) {
      const body = {
        name: v.nome,
        cpf: this.digitsOnly(v.cpf),
        phone: this.digitsOnly(v.telefone),
        birthDate: this.toYYYYMMDD(v.birthDate),
        email: v.email,
        password: v.password,
        roles: ['TEACHER'] as string[], // opcional
      };

      this.users.signupPerson(body).subscribe({
        next: () => {
          if (v.rememberMe) {
            localStorage.setItem('qg_remember_email', '1');
            localStorage.setItem('qg_last_email', v.email);
          } else {
            localStorage.removeItem('qg_remember_email');
            localStorage.removeItem('qg_last_email');
          }
          this.loading.set(false);
          this.router.navigateByUrl('/dashboard');
        },
        error: (e) => {
          const apiMsg =
            e?.error?.details?.fields?.[0]?.message ||
            e?.error?.message ||
            'Não foi possível criar a conta.';
          this.error.set(apiMsg);
          this.loading.set(false);
        },
      });
    } else {
      this.error.set('Cadastro de Quadras ainda não disponível.');
      this.loading.set(false);
    }
  }
}
