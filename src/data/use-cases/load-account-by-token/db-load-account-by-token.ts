import { Account } from '../../../domain/entities/account';
import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token';
import { Decrypter } from '../../protocols/cryptography/decrypter';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';

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
