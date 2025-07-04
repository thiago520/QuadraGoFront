import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AlunoService } from '../../services/aluno.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aluno-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './aluno-form.component.html',
  styleUrl: './aluno-form.component.scss'
})
export class AlunoFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alunoService: AlunoService,
    private router: Router
  ) {

    this.form = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      email: ['', [Validators.email]],
      plano: ['', Validators.required],
    });
  }

  salvar() {
    if (this.form.valid) {
      this.alunoService.salvar(this.form.value).subscribe({
        next: () => {
          console.log('Salvo com sucesso');
          this.router.navigate(['/professor/alunos']); // voltar para listagem
        },
        error: (err) => {
          console.error('Erro ao salvar:', err);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
