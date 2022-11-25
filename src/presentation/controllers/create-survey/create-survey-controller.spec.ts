/* eslint-disable max-classes-per-file */

import { badRequest } from '../../helpers/http/http-helper';
import { CreateSurveyController } from './create-survey-controller';
import {
  CreateSurvey,
  CreateSurveyDTO,
  HttpRequest,
  Validation,
} from './create-survey-controller-protocols';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
  },
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

const makeCreateSurvey = (): CreateSurvey => {
  class CreateSurveyStub implements CreateSurvey {
    async create(data: CreateSurveyDTO): Promise<void> {
      return Promise.resolve();
    }
  }

  return new CreateSurveyStub();
};

interface SutTypes {
  sut: CreateSurveyController;
  validationStub: Validation;
  createSurveyStub: CreateSurvey;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const createSurveyStub = makeCreateSurvey();
  const sut = new CreateSurveyController(validationStub, createSurveyStub);

  return {
    sut,
    validationStub,
    createSurveyStub,
  };
};

describe('CreateSurvey Controller', () => {
  test('Should be able to call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    await sut.handle(makeFakeRequest());

    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body);
  });

  test('Should be able to return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test('Should be able to call CreateSurvey with correct values', async () => {
    const { sut, createSurveyStub } = makeSut();

    const createSurveySpy = jest.spyOn(createSurveyStub, 'create');

    await sut.handle(makeFakeRequest());

    expect(createSurveySpy).toHaveBeenCalledWith(makeFakeRequest().body);
  });
});
