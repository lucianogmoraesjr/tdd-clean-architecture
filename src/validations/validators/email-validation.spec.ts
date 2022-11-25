/* eslint-disable max-classes-per-file */
import { EmailValidation } from './email-validation';
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamError } from '../../presentation/errors';

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new EmailValidation('email', emailValidatorStub);

  return { emailValidatorStub, sut };
};

describe('EmailValidation', () => {
  test('Should be able to return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({ email: 'any_email@mail.com' });

    expect(error).toEqual(new InvalidParamError('email'));
  });

  test('Should be able to call EmailValidator with correct email value', () => {
    const { sut, emailValidatorStub } = makeSut();

    const emailValidatorSpy = jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false);

    sut.validate({ email: 'any_email@mail.com' });

    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should be able to throw if EmailValidator throws exception', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
