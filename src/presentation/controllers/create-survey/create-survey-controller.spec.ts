import { CreateSurveyController } from './create-survey-controller';
import { HttpRequest, Validation } from './create-survey-controller-protocols';

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

interface SutTypes {
  sut: CreateSurveyController;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new CreateSurveyController(validationStub);

  return {
    sut,
    validationStub,
  };
};

describe('CreateSurvey Controller', () => {
  test('Should be able to call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    await sut.handle(makeFakeRequest());

    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body);
  });
});
