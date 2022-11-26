import { Account } from '../../../domain/entities/account';
import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token';
import { Decrypter } from '../../protocols/cryptography/decrypter';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(
    accessToken: string,
    role?: string | undefined,
  ): Promise<Account | null> {
    await this.decrypter.decrypt(accessToken);
    return null;
  }
}
