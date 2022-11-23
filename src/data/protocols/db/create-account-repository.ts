import { Account } from '../../../domain/entities/account';
import { CreateAccountDTO } from '../../../domain/use-cases/create-account';

export interface CreateAccountRepository {
  execute(account: CreateAccountDTO): Promise<Account>;
}
