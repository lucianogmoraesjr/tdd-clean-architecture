/* eslint-disable max-classes-per-file */
import { Account } from '../../../domain/entities/account';
import { HttpRequest, Validation } from './sign-up-controller-protocols';
import { SignUpController } from './sign-up-controller';
import { serverError, ok, badRequest } from '../../helpers/http/http-helper';
import { MissingParamError, ServerError } from '../../errors';

import {
  CreateAccount,
  CreateAccountDTO,
} from '../../../domain/use-cases/create-account';

const makeCreateAccountStub = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    async execute(account: CreateAccountDTO): Promise<Account> {
      return Promise.resolve(makeFakeAccount());
    }
  }

  return new CreateAccountStub();
};

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

const makeFakeAccount = (): Account => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

interface SutTypes {
  sut: SignUpController;
  createAccountStub: CreateAccount;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const createAccountStub = makeCreateAccountStub();
  const validationStub = makeValidationStub();
  const sut = new SignUpController(createAccountStub, validationStub);

  return { createAccountStub, validationStub, sut };
};

describe('SignUp Controller', () => {
  test('Should be able to call CreateAccount with correct data', async () => {
    const { sut, createAccountStub } = makeSut();

    const createAccountStubExecuteSpy = jest.spyOn(
      createAccountStub,
      'execute',
    );

    await sut.handle(makeFakeRequest());

    expect(createAccountStubExecuteSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should be able to return 500 if CreateAccount throws exception', async () => {
    const { sut, createAccountStub } = makeSut();

    jest.spyOn(createAccountStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError('')));
  });

  test('Should be able to return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should be able to call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should be able to return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });
});
