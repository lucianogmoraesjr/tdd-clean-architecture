import request from 'supertest';
import { Collection } from 'mongodb';
import MongoHelper from '../../../infra/db/mongodb/helpers/mongo-helper';
import app from '../../config/app';

let surveyCollection: Collection;

describe('Survey Routes', () => {
  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should be able to return 201 on create survey success', async () => {
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
      .expect(201);
  });
});
