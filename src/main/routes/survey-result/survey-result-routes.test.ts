import request from 'supertest';
import { Collection } from 'mongodb';
import MongoHelper from '../../../infra/db/mongodb/helpers/mongo-helper';
import app from '../../config/app';

let surveyCollection: Collection;
let accountCollection: Collection;

describe('Survey Routes', () => {
  beforeEach(async () => {
    // surveyCollection = MongoHelper.getCollection('surveys');
    // accountCollection = MongoHelper.getCollection('accounts');
    // await surveyCollection.deleteMany({});
    // await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    // await MongoHelper.disconnect();
  });

  test('Should be able to return 403 on save survey result without access token', async () => {
    await request(app)
      .put('/api/survey/any_id/results')
      .send({
        answer: 'any_answer',
      })
      .expect(403);
  });
});
