import { Account } from '../../../domain/entities/account';
import {
  CreateAccount,
  CreateAccountDTO,
} from '../../../domain/use-cases/create-account';
import { Encrypter } from '../../protocols/encrypter';

export class DbCreateAccount implements CreateAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async execute(account: CreateAccountDTO): Promise<Account> {
    await this.encrypter.encrypt(account.password);
    const newAccount = { ...account, id: '1' };
    return newAccount;
  }
}
