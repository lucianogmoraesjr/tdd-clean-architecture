import {
  Authentication,
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository,
  AuthenticationDTO,
} from './db-authentication-protocols';

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
