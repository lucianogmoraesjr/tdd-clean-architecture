/* eslint-disable max-classes-per-file */
import { LoginController } from './login';
import {
  HttpRequest,
  Authentication,
  Validation,
  AuthenticationDTO,
} from './login-protocols';
import { MissingParamError } from '../../errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http/http-helper';

interface SutTypes {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    execute(data: AuthenticationDTO): Promise<string> {
      return Promise.resolve('any_token');
    }
  }

  return new AuthenticationStub();
};

const makeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password',
    },
  };
};

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidationStub();
  const sut = new LoginController(authenticationStub, validationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

describe('Login Controller', () => {
  test('Should be able to call Authentication with correct value', async () => {
    const { sut, authenticationStub } = makeSut();

    const isValidSpy = jest.spyOn(authenticationStub, 'execute');

    await sut.handle(makeRequest());

    expect(isValidSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should be able to return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'execute').mockResolvedValueOnce(null);

    const httpResponse = await sut.handle(makeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should be able to return 500 if Authentication throws exception', async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(makeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should be able to return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  test('Should be able to call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should be able to return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(makeRequest());

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });
});
