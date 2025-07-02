export interface Aula {
  id: string;
  professorId: string;
  alunoId: string;
  dataHora: Date;
  status: 'agendada' | 'concluída' | 'cancelada';
}
