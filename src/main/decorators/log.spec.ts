/* eslint-disable max-classes-per-file */
import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { Account } from '../../domain/entities/account';
import { ok, serverError } from '../../presentation/helpers/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepository: LogErrorRepository;
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(makeFakeAccount()));
    }
  }

  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }

  return new LogErrorRepositoryStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeFakeAccount = (): Account => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';

  return serverError(fakeError);
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepository = makeLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepository);

  return {
    sut,
    controllerStub,
    logErrorRepository,
  };
};

describe('Log Controller Decorator', () => {
  test('Should be able to call controller handle', async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should be able to return same result of the controller', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should be able to call LogErrorRepository with correct server error', async () => {
    const { sut, controllerStub, logErrorRepository } = makeSut();

    const logSpy = jest.spyOn(logErrorRepository, 'logError');

    jest
      .spyOn(controllerStub, 'handle')
      .mockResolvedValueOnce(makeFakeServerError());

    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
