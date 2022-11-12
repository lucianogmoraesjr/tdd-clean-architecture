import { Account } from '../entities/account';

export interface CreateAccountDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreateAccount {
  execute(account: CreateAccountDTO): Promise<Account>;
}
