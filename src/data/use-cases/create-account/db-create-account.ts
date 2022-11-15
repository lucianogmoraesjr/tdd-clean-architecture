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

  async execute(accountData: CreateAccountDTO): Promise<Account> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);

    const newAccount = { ...accountData, password: hashedPassword };

    const account = await this.createAccountRepository.execute(newAccount);

    return account;
  }
}
