import { Survey } from '../../../../domain/entities/survey';
import { InvalidParamError } from '../../../errors';
import { forbidden, serverError } from '../../../helpers/http/http-helper';
import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  HttpRequest,
  LoadSurveyById,
} from './save-survey-result-controller-protocols';

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
});

const makeFakeSurvey = (): Survey => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<Survey | null> {
      return Promise.resolve(makeFakeSurvey());
    }
  }

  return new LoadSurveyByIdStub();
};

interface SutTypes {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);

  return {
    sut,
    loadSurveyByIdStub,
  };
};

describe('SaveSurveyResult Controller', () => {
  test('Should be able to call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    await sut.handle(makeFakeRequest());

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should be able to return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null);

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should be able to return 500 if LoadSurveyById throws an exception', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
