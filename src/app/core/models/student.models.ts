export interface Student {
  id: string;
  name: string;
  telefone: string;
  email: string;
  dataCadastro: Date;
  plan: string;
  age?: Date;
  status?: 'active' | 'inactive';
}

export type CreateStudentDTO = Omit<Student, 'id'>;
export type UpdateStudentDTO = Partial<CreateStudentDTO>;
