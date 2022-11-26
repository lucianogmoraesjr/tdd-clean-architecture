import { Account } from '../entities/account';

export interface LoadAccountByToken {
  load(accessToken: string, role?: string): Promise<Account | null>;
}
