import {
  Authentication,
  AuthenticationDTO,
} from '../../../domain/use-cases/authentication';
import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { TokenGenerator } from '../../protocols/cryptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
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
        await this.updateAccessTokenRepository.execute(account.id, accessToken);
        return accessToken;
      }
    }

    return null;
  }
}
