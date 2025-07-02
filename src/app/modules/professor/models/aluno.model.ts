export interface Aluno {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  dataCadastro: Date;
  plano: string;
  ativo: boolean;
}
