import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    MatToolbar,
    CommonModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  selectedOption: string = 'professor'; //Padrão para Professores

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  // Campos para Pessoa Física
  nome: string = '';
  cpf: string = '';
  telefone: string = '';
  // Campos para Pessoa Jurídica
  razaoSocial: string = '';
  cnpj: string = '';
  nomeResponsavel: string = '';
  telefoneComercial: string = '';

  options = [
    { value: 'professor', viewValue: 'Para Professores' },
    { value: 'quadra', viewValue: 'Para Quadras Esportivas' }
  ];

  isProfessor(): boolean {
    return this.selectedOption === 'professor';
  }

  isQuadra(): boolean {
    return this.selectedOption === 'quadra';
  }
}
