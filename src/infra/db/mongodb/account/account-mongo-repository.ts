import { ObjectId } from 'mongodb';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';
import { CreateAccountRepository } from '../../../../data/use-cases/create-account/db-create-account-protocols';
import { Account } from '../../../../domain/entities/account';
import { CreateAccountDTO } from '../../../../domain/use-cases/create-account';

import MongoHelper from '../helpers/mongo-helper';

export class AccountMongoRepository
  implements
    CreateAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
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

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          accessToken: token,
        },
      },
    );
  }

  async loadByToken(
    token: string,
    role?: string | undefined,
  ): Promise<Account | null> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.findOne({
      accessToken: token,
      role,
    });

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
