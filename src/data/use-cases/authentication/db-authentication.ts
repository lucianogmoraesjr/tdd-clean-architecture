import {
  Authentication,
  AuthenticationDTO,
} from '../../../domain/use-cases/authentication';
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async execute(data: AuthenticationDTO): Promise<string | null> {
    await this.loadAccountByEmailRepository.execute(data.email);
    return null;
  }
}
