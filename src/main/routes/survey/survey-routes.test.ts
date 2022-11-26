import request from 'supertest';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import MongoHelper from '../../../infra/db/mongodb/helpers/mongo-helper';
import app from '../../config/app';

let surveyCollection: Collection;
let accountCollection: Collection;

describe('Survey Routes', () => {
  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    accountCollection = MongoHelper.getCollection('accounts');
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should be able to return 403 on create survey without access token', async () => {
    await request(app)
      .post('/api/survey')
      .send({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com',
          },
          {
            answer: 'Answer 2',
          },
        ],
      })
      .expect(403);
  });

  test('Should be able to return 201 on create survey with access token', async () => {
    const result = await accountCollection.insertOne({
      name: 'John',
      email: 'john@mail.com',
      password: '123',
      role: 'admin',
    });

    const id = result.insertedId.toString();

    const accessToken = sign({ id }, 'teste123');

    await accountCollection.updateOne(
      {
        _id: result.insertedId,
      },
      {
        $set: {
          accessToken,
        },
      },
    );

    await request(app)
      .post('/api/survey')
      .set('x-access-token', accessToken)
      .send({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com',
          },
          {
            answer: 'Answer 2',
          },
        ],
      })
      .expect(201);
  });
});
