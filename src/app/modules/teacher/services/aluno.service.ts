import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private readonly API = 'http://localhost:8080/api/alunos';

  constructor(private http: HttpClient) { }

  listar(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.API);
  }

  buscaPorId(id: string): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.API}/${id}`);
  }

  salvar(aluno: Aluno): Observable<Aluno> {
    return this.http.post<Aluno>(this.API, aluno);
  }

  atualizar(id: string, aluno: Aluno): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.API}/${id}`, aluno);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
