import { Account } from '../../domain/entities/account';

export interface LoadAccountByEmailRepository {
  execute(email: string): Promise<Account>;
}
