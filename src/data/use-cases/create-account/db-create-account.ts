import {
  CreateAccount,
  Hasher,
  CreateAccountDTO,
  Account,
  CreateAccountRepository,
  LoadAccountByEmailRepository,
} from './db-create-account-protocols';

export class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async execute(accountData: CreateAccountDTO): Promise<Account> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    const hashedPassword = await this.hasher.hash(accountData.password);

    const newAccount = { ...accountData, password: hashedPassword };

    const account = await this.createAccountRepository.create(newAccount);

    return account;
  }
}
