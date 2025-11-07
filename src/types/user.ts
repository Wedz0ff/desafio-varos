// Shared types that can be used in both client and server components

export enum UserType {
  CONSULTANT = "CONSULTANT",
  CLIENT = "CLIENT",
}

export type CreateUserInput = {
  name: string;
  email: string;
  phone: string;
  age?: number;
  cpf: string;
  cep: string;
  address: string;
  complement?: string;
  type: UserType;
  consultantId?: string;
};

export type UpdateUserInput = Partial<CreateUserInput> & {
  id: string;
};
