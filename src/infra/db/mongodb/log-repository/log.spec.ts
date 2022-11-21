import { Collection } from 'mongodb';
import MongoHelper from '../helpers/mongo-helper';
import { LogMongoRepository } from './log';

describe('Log Mongo Repository', () => {
  let errorCollection: Collection;

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should be able to create an error log', async () => {
    const sut = new LogMongoRepository();

    await sut.logError('any_error');

    const count = await errorCollection.countDocuments();

    expect(count).toBe(1);
  });
});
