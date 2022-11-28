import {
  LoadAccountByToken,
  Decrypter,
  LoadAccountByTokenRepository,
  Account,
} from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(
    accessToken: string,
    role?: string | undefined,
  ): Promise<Account | null> {
    const decryptedToken = await this.decrypter.decrypt(accessToken);

    if (!decryptedToken) {
      return null;
    }

    const account = await this.loadAccountByTokenRepository.loadByToken(
      accessToken,
      role,
    );

    return account;
  }
}
