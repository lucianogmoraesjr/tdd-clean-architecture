import {
  CreateAccount,
  Hasher,
  CreateAccountDTO,
  Account,
  CreateAccountRepository,
} from './db-create-account-protocols';

export class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository,
  ) {}

  async execute(accountData: CreateAccountDTO): Promise<Account> {
    const hashedPassword = await this.hasher.execute(accountData.password);

    const newAccount = { ...accountData, password: hashedPassword };

    const account = await this.createAccountRepository.execute(newAccount);

    return account;
  }
}
