import {
  CreateAccount,
  Encrypter,
  CreateAccountDTO,
  Account,
} from './db-create-account-protocols';

export class DbCreateAccount implements CreateAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async execute(account: CreateAccountDTO): Promise<Account> {
    await this.encrypter.encrypt(account.password);
    const newAccount = { ...account, id: '1' };
    return newAccount;
  }
}
