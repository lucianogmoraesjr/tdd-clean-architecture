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
      date: new Date(),
    });

    const survey = await surveyCollection.findOne({ question: 'any_question' });

    expect(survey).toBeTruthy();
  });

  test('Should be able to list surveys', async () => {
    const { sut } = makeSut();

    await surveyCollection.insertMany([
      {
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
        ],
        date: new Date(),
      },
      {
        question: 'other_question',
        answers: [
          {
            image: 'other_image',
            answer: 'other_answer',
          },
        ],
        date: new Date(),
      },
    ]);

    const surveys = await sut.list();

    expect(surveys.length).toBe(2);
    expect(surveys[0].question).toBe('any_question');
    expect(surveys[1].question).toBe('other_question');
  });

  test('Should be able to list empty surveys', async () => {
    const { sut } = makeSut();

    const surveys = await sut.list();

    expect(surveys.length).toBe(0);
  });
});
