import { Collection } from 'mongodb';
import MongoHelper from '../helpers/mongo-helper';

import { SurveyMongoRepository } from './survey-mongo-repository';

let surveyCollection: Collection;

interface SutTypes {
  sut: SurveyMongoRepository;
}

const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository();

  return {
    sut,
  };
};

describe('Survey Mongo Repository', () => {
  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should be able to insert a survey', async () => {
    const { sut } = makeSut();

    await sut.create({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
        {
          answer: 'other_answer',
        },
      ],
    });

    const survey = await surveyCollection.findOne({ question: 'any_question' });

    expect(survey).toBeTruthy();
  });
});
