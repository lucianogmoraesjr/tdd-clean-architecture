import {
  Authentication,
  AuthenticationDTO,
} from '../../../domain/use-cases/authentication';
import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { TokenGenerator } from '../../protocols/cryptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(data: AuthenticationDTO): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.execute(data.email);

    if (account) {
      const isValid = await this.hashComparer.execute(
        data.password,
        account.password,
      );

      if (isValid) {
        const accessToken = await this.tokenGenerator.execute(account.id);
        return accessToken;
      }
    }

    return null;
  }
}
