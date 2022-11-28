import MockDate from 'mockdate';
import { ListSurveysController } from './list-surveys-controller';
import { Survey, ListSurveys } from './list-surveys-controller-protocols';

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

const makeListSurveysStub = (): ListSurveys => {
  class ListSurveysStub implements ListSurveys {
    async list(): Promise<Survey[]> {
      return Promise.resolve(makeFakeSurveys());
    }
  }

  return new ListSurveysStub();
};

interface SutTypes {
  sut: ListSurveysController;
  listSurveysStub: ListSurveys;
}

const makeSut = (): SutTypes => {
  const listSurveysStub = makeListSurveysStub();
  const sut = new ListSurveysController(listSurveysStub);

  return {
    sut,
    listSurveysStub,
  };
};

describe('ListSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call ListSurveys', async () => {
    const { sut, listSurveysStub } = makeSut();

    const listSpy = jest.spyOn(listSurveysStub, 'list');

    await sut.handle({});

    expect(listSpy).toHaveBeenCalled();
  });
});
