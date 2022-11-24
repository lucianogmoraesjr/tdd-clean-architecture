import { CreateAccountRepository } from '../../../../data/protocols/db/create-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { Account } from '../../../../domain/entities/account';
import { CreateAccountDTO } from '../../../../domain/use-cases/create-account';

import MongoHelper from '../helpers/mongo-helper';

export class AccountMongoRepository
  implements CreateAccountRepository, LoadAccountByEmailRepository
{
  async create(account: CreateAccountDTO): Promise<Account> {
    const accountCollection = MongoHelper.getCollection('accounts');

    await accountCollection.insertOne(account);

    const { _id, ...rest } = account as any;

    const newAccount = { ...rest, id: _id.toString() };

    return newAccount;
  }

  async loadByEmail(email: string): Promise<Account | null> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.findOne({ email });

    if (!result) {
      return null;
    }

    const { _id, ...rest } = result as any;

    const account: Account = {
      ...rest,
      id: _id.toString(),
    };

    return account;
  }
}
