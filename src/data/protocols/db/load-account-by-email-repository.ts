import { Account } from '../../../domain/entities/account';

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<Account | null>;
}
