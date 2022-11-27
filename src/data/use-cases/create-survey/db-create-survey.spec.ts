import MockDate from 'mockdate';
import { DbCreateSurvey } from './db-create-survey';
import {
  CreateSurveyDTO,
  CreateSurveyRepository,
} from './db-create-survey-protocols';

const makeFakeSurveyData = (): CreateSurveyDTO => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const makeCreateSurveyRepositoryStub = (): CreateSurveyRepository => {
  class CreateSurveyRepositoryStub implements CreateSurveyRepository {
    async create(surveyData: CreateSurveyDTO): Promise<void> {
      return Promise.resolve();
    }
  }

  return new CreateSurveyRepositoryStub();
};

interface SutTypes {
  sut: DbCreateSurvey;
  createSurveyRepository: CreateSurveyRepository;
}

const makeSut = (): SutTypes => {
  const createSurveyRepository = makeCreateSurveyRepositoryStub();
  const sut = new DbCreateSurvey(createSurveyRepository);

  return {
    sut,
    createSurveyRepository,
  };
};

describe('DbCreateSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  beforeAll(() => {
    MockDate.reset();
  });

  test('Should be able to call CreateSurveyRepository with correct values', async () => {
    const { sut, createSurveyRepository } = makeSut();

    const createSpy = jest.spyOn(createSurveyRepository, 'create');

    const surveyData = makeFakeSurveyData();

    await sut.create(surveyData);

    expect(createSpy).toHaveBeenCalledWith(surveyData);
  });

  test('Should be able to throw if CreateSurveyRepository throws an exception', async () => {
    const { sut, createSurveyRepository } = makeSut();

    jest
      .spyOn(createSurveyRepository, 'create')
      .mockRejectedValueOnce(new Error());

    await expect(sut.create(makeFakeSurveyData())).rejects.toThrow();
  });
});
