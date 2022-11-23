/* eslint-disable max-classes-per-file */
import { LoginController } from './login';
import { HttpRequest, Authentication, EmailValidator } from './login-protocols';
import { InvalidParamError, MissingParamError } from '../../errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http-helper';

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    execute(email: string, password: string): Promise<string> {
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
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

describe('Login Controller', () => {
  test('Should be able to return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should be able to return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should be able to return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeRequest());

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should be able to call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeRequest());

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should be able to return 500 if EmailValidator throws exception', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should be able to call Authentication with correct value', async () => {
    const { sut, authenticationStub } = makeSut();

    const isValidSpy = jest.spyOn(authenticationStub, 'execute');

    await sut.handle(makeRequest());

    expect(isValidSpy).toHaveBeenCalledWith(
      'any_email@mail.com',
      'any_password',
    );
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
});
