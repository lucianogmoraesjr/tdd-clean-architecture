import { CreateAccountRepository } from '../../../../data/protocols/create-account-repository';
import { Account } from '../../../../domain/entities/account';
import { CreateAccountDTO } from '../../../../domain/use-cases/create-account';

import MongoHelper from '../helpers/mongo-helper';

export class AccountMongoRepository implements CreateAccountRepository {
  async execute(account: CreateAccountDTO): Promise<Account> {
    const accountCollection = MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(account);

    return { ...account, id: result.insertedId.toString() };
  }
}
