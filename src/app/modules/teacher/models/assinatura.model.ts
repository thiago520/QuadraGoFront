export interface Assinatura {
  id: string;
  alunoId: string;
  valor: number;
  dataInicio: Date;
  dataFim: Date;
  statusPagamento: 'pago' | 'pendente' | 'vencido';
}
