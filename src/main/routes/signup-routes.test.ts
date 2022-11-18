import request from 'supertest';
import MongoHelper from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';

describe('SignUp Routes', () => {
  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should be able to return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'John',
        email: 'john@mail.com',
        password: '123',
        passwordConfirmation: '123',
      })
      .expect(200);
  });
});
