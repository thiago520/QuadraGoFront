import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

type StudentStatus = 'Ativo' | 'Inativo';

interface Student {
  id: number;
  name: string;
  phone: string;
  birthDate: Date | string;
  status: StudentStatus;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent {
  // mock inicial (substitua por API)
  students: Student[] = [
    {
      id: 1,
      name: 'Maria Silva Santos',
      phone: '(11) 99999-8888',
      birthDate: new Date(1995, 2, 14),
      status: 'Ativo',
    },
    {
      id: 2,
      name: 'João Pedro Oliveira',
      phone: '(11) 88888-7777',
      birthDate: new Date(1990, 6, 21),
      status: 'Ativo',
    },
    {
      id: 3,
      name: 'Ana Costa Ferreira',
      phone: '(11) 77777-6666',
      birthDate: new Date(1998, 10, 7),
      status: 'Ativo',
    },
    {
      id: 4,
      name: 'Pedro Lima da Silva',
      phone: '(11) 66666-5555',
      birthDate: new Date(1986, 6, 15),
      status: 'Inativo',
    },
    {
      id: 5,
      name: 'Carla Mendes Souza',
      phone: '(11) 55555-4444',
      birthDate: new Date(1997, 4, 11),
      status: 'Ativo',
    },
  ];

  // busca
  query = '';
  filtered: Student[] = [...this.students];

  // métricas de topo
  totals = {
    total: this.students.length,
    active: this.students.filter((s) => s.status === 'Ativo').length,
    lessonsThisWeek: 23, // mock – substitua pelo valor vindo da API
  };

  onSearchChange(q: string) {
    const v = (q || '').trim().toLowerCase();
    this.filtered = !v
      ? [...this.students]
      : this.students.filter((s) => s.name.toLowerCase().includes(v));
  }

  clearSearch() {
    this.query = '';
    this.filtered = [...this.students];
  }

  getAge(birth: Date | string): number {
    const d = new Date(birth);
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--;
    }
    return age;
  }

  onDelete(s: Student) {
    // substitua por dialog/confirm e chamada API
    if (confirm(`Excluir aluno "${s.name}"?`)) {
      this.students = this.students.filter((x) => x.id !== s.id);
      this.onSearchChange(this.query); // re-filtra
      this.totals = {
        total: this.students.length,
        active: this.students.filter((st) => st.status === 'Ativo').length,
        lessonsThisWeek: this.totals.lessonsThisWeek,
      };
    }
  }
}
