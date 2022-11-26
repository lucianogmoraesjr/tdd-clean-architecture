import { Account } from '../../../../domain/entities/account';

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?: string): Promise<Account | null>;
}
