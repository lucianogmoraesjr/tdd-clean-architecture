import { CreateAccountRepository } from '../../../../data/protocols/create-account-repository';
import { Account } from '../../../../domain/entities/account';
import { CreateAccountDTO } from '../../../../domain/use-cases/create-account';

import MongoHelper from '../helpers/mongo-helper';

export class AccountMongoRepository implements CreateAccountRepository {
  async execute(account: CreateAccountDTO): Promise<Account> {
    const accountCollection = MongoHelper.getCollection('accounts');

    await accountCollection.insertOne(account);

    const { _id, ...rest } = account as any;

    const newAccount = { ...rest, id: _id.toString() };

    return newAccount;
  }
}
