import {
  CreateAccount,
  Encrypter,
  CreateAccountDTO,
  Account,
  CreateAccountRepository,
} from './db-create-account-protocols';

export class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly createAccountRepository: CreateAccountRepository,
  ) {}

  async execute(account: CreateAccountDTO): Promise<Account> {
    const hashedPassword = await this.encrypter.encrypt(account.password);

    const newAccount = { ...account, password: hashedPassword };

    await this.createAccountRepository.execute(newAccount);

    return {
      ...newAccount,
      id: '1',
    };
  }
}
