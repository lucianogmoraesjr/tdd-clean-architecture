import { Collection } from 'mongodb';
import { Account } from '../../../../domain/entities/account';
import { Survey } from '../../../../domain/entities/survey';
import MongoHelper from '../helpers/mongo-helper';

import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

let surveyResultCollection: Collection;
let surveyCollection: Collection;
let accountCollection: Collection;

const makeSurvey = async (): Promise<Survey> => {
  const surveyData = {
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
  };

  const resultMongo = await surveyCollection.insertOne(surveyData);

  const { insertedId } = resultMongo;

  const survey: Survey = {
    ...surveyData,
    id: insertedId.toString(),
  };

  return survey;
};

const makeAccount = async (): Promise<Account> => {
  const accountData = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  };

  const resultMongo = await accountCollection.insertOne(accountData);

  const { insertedId } = resultMongo;

  const account: Account = {
    ...accountData,
    id: insertedId.toString(),
  };

  return account;
};

interface SutTypes {
  sut: SurveyResultMongoRepository;
}

const makeSut = (): SutTypes => {
  const sut = new SurveyResultMongoRepository();

  return {
    sut,
  };
};

describe('Survey Mongo Repository', () => {
  beforeEach(async () => {
    surveyResultCollection = MongoHelper.getCollection('survey_result');
    await surveyResultCollection.deleteMany({});
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    accountCollection = MongoHelper.getCollection('account');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should be able to insert a survey result if its new', async () => {
    const { sut } = makeSut();
    const survey = await makeSurvey();
    const account = await makeAccount();

    const surveyResult = await sut.save({
      surveyId: survey.id,
      accountId: account.id,
      answer: survey.answers[0].answer,
      date: new Date(),
    });

    expect(surveyResult).toBeTruthy();
    expect(surveyResult.id).toBeTruthy();
    expect(surveyResult.answer).toBe(survey.answers[0].answer);
  });
});
