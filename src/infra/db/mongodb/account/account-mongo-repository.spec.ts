import { Collection } from 'mongodb';
import MongoHelper from '../helpers/mongo-helper';

import { AccountMongoRepository } from './account-mongo-repository';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should be able to return an account on create success', async () => {
    const sut = new AccountMongoRepository();

    const account = await sut.create({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
    expect(account.password).toBe('any_password');
  });

  test('Should be able to return an account on loadByEmail success', async () => {
    const sut = new AccountMongoRepository();

    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    const account = await sut.loadByEmail('any_email@mail.com');

    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe('any_name');
    expect(account?.email).toBe('any_email@mail.com');
    expect(account?.password).toBe('any_password');
  });

  test('Should be able to return null if loadByEmail fails', async () => {
    const sut = new AccountMongoRepository();

    const account = await sut.loadByEmail('any_email@mail.com');

    expect(account).toBeFalsy();
  });

  test('Should be able to update access token on updateAccessToken success', async () => {
    const sut = new AccountMongoRepository();

    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    const account = await accountCollection.findOne({ _id: result.insertedId });

    expect(account?.accessToken).toBeFalsy();

    await sut.updateAccessToken(result.insertedId.toString(), 'any_token');

    expect(account).toBeTruthy();
  });

  test('Should be able to return an account on loadByToken success without role', async () => {
    const sut = new AccountMongoRepository();

    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      accessToken: 'any_token',
    });

    const account = await sut.loadByToken('any_token');

    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe('any_name');
    expect(account?.email).toBe('any_email@mail.com');
    expect(account?.password).toBe('any_password');
  });

  test('Should be able to return an account on loadByToken success with role', async () => {
    const sut = new AccountMongoRepository();

    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      accessToken: 'any_token',
      role: 'any_role',
    });

    const account = await sut.loadByToken('any_token', 'any_role');

    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe('any_name');
    expect(account?.email).toBe('any_email@mail.com');
    expect(account?.password).toBe('any_password');
  });
});
