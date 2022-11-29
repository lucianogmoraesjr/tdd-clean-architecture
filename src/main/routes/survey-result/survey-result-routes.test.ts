import request from 'supertest';
import { Collection, ObjectId } from 'mongodb';
import { sign } from 'jsonwebtoken';
import MongoHelper from '../../../infra/db/mongodb/helpers/mongo-helper';
import app from '../../config/app';

let surveyCollection: Collection;
let accountCollection: Collection;

const jwtSecret = 'teste123';

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'John',
    email: 'john@mail.com',
    password: '123',
    role: 'admin',
  });

  const id = result.insertedId.toString();
  const accessToken = sign({ id }, jwtSecret);

  await accountCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        accessToken,
      },
    },
  );

  return accessToken;
};

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

  test('Should be able to return 403 on save survey result without access token', async () => {
    await request(app)
      .put('/api/survey/any_id/results')
      .send({
        answer: 'any_answer',
      })
      .expect(403);
  });

  test('Should be able to return 200 on save survey result with valid access token', async () => {
    const accessToken = await makeAccessToken();
    const result = await surveyCollection.insertOne({
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
      date: new Date(),
    });

    await request(app)
      .put(`/api/survey/${result.insertedId.toString()}/results`)
      .set('x-access-token', accessToken)
      .send({
        answer: 'Answer 1',
      })
      .expect(200);
  });
});
