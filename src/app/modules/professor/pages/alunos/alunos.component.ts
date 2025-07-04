import { Component, OnInit } from '@angular/core';
import { Aluno } from '../../models/aluno.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AlunoService } from '../../services/aluno.service';

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './alunos.component.html',
  styleUrl: './alunos.component.scss'
})
export class AlunosComponent implements OnInit {
  filtro: string = '';
  alunos: Aluno[] = [];

  constructor(private alunoService: AlunoService) {}

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.alunoService.listar().subscribe({
      next: (res) => this.alunos = res,
      error: (err) => console.error('Erro ao carregar alunos', err)
    });
  }

  get alunosFiltrados(): Aluno[] {
    return this.alunos.filter(a => a.nome.toLowerCase().includes(this.filtro.toLowerCase()));
  }

  editar(aluno: Aluno) {
    console.log(`Editar`, aluno);
  }

   excluir(aluno: Aluno) {
    if (confirm(`Excluir aluno ${aluno.nome}?`)) {
      this.alunoService.excluir(aluno.id).subscribe(() => {
        this.carregarAlunos(); // Atualiza a lista
      });
    }
  }
}
