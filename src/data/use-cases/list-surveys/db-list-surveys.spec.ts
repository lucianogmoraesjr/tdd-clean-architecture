import { DbListSurveys } from './db-list-surveys';
import { Survey, ListSurveysRepository } from './db-list-surveys-protocols';

const makeFakeSurveys = (): Survey[] => [
  {
    id: 'any_id',
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
    id: 'other_id',
    question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer',
      },
    ],
    date: new Date(),
  },
];

const makeListSurveysRepository = (): ListSurveysRepository => {
  class ListSurveysRepositoryStub implements ListSurveysRepository {
    async list(): Promise<Survey[]> {
      return Promise.resolve(makeFakeSurveys());
    }
  }

  return new ListSurveysRepositoryStub();
};

interface SutTypes {
  sut: DbListSurveys;
  listSurveysRepositoryStub: ListSurveysRepository;
}

const makeSut = (): SutTypes => {
  const listSurveysRepositoryStub = makeListSurveysRepository();
  const sut = new DbListSurveys(listSurveysRepositoryStub);

  return {
    sut,
    listSurveysRepositoryStub,
  };
};

describe('DbListSurveys', () => {
  test('Should be able to call ListSurveysRepository', async () => {
    const { sut, listSurveysRepositoryStub } = makeSut();
    const listSpy = jest.spyOn(listSurveysRepositoryStub, 'list');

    await sut.list();

    expect(listSpy).toHaveBeenCalled();
  });

  test('Should be able to return a list of surveys on success', async () => {
    const { sut, listSurveysRepositoryStub } = makeSut();
    const listSpy = jest.spyOn(listSurveysRepositoryStub, 'list');

    await sut.list();

    expect(listSpy).toHaveBeenCalled();
  });

  test('Should be able to throw if ListSurveysRepository throws an exception', async () => {
    const { sut, listSurveysRepositoryStub } = makeSut();
    jest
      .spyOn(listSurveysRepositoryStub, 'list')
      .mockRejectedValueOnce(new Error());

    await expect(sut.list()).rejects.toThrow();
  });
});
