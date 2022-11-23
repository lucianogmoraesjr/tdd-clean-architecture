import {
  Authentication,
  AuthenticationDTO,
} from '../../../domain/use-cases/authentication';
import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
  ) {}

  async execute(data: AuthenticationDTO): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.execute(data.email);

    if (account) {
      await this.hashComparer.execute(data.password, account?.password);
    }

    return null;
  }
}
