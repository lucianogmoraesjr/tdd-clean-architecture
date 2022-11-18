import MongoHelper from '../helpers/mongo-helper';

import { AccountMongoRepository } from './account';

describe('Account Mongo Repository', () => {
  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should be able to return an account on success', async () => {
    const sut = new AccountMongoRepository();

    const account = await sut.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email');
    expect(account.password).toBe('any_password');
  });
});
