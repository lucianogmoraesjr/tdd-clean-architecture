import { hash } from 'bcrypt';
import { Collection } from 'mongodb';
import request from 'supertest';
import MongoHelper from '../../../infra/db/mongodb/helpers/mongo-helper';
import app from '../../config/app';

let accountCollection: Collection;

describe('Login Routes', () => {
  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should be able to login an existing account', async () => {
    const hashedPassword = await hash('123', 12);

    await accountCollection.insertOne({
      name: 'John',
      email: 'john@mail.com',
      password: hashedPassword,
    });

    await request(app)
      .post('/api/login')
      .send({
        email: 'john@mail.com',
        password: '123',
      })
      .expect(200);
  });

  test('Should be able to return 401 unauthorized if credentials are invalid', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'john@mail.com',
        password: '123',
      })
      .expect(401);
  });
});
