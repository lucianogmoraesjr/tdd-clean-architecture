import { Account } from '../entities/account';

export interface CreateAccountDTO {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface CreateAccount {
  execute(account: CreateAccountDTO): Account;
}
