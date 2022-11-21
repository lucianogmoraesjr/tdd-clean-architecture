/* eslint-disable max-classes-per-file */
import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helper';
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
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'John Doe',
        },
      };

      return Promise.resolve(httpResponse);
    }
  }

  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }

  return new LogErrorRepositoryStub();
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

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('Should be able to return same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'John Doe',
      },
    });
  });

  test('Should be able to call LogErrorRepository with correct server error', async () => {
    const { sut, controllerStub, logErrorRepository } = makeSut();

    const fakeError = new Error();

    fakeError.stack = 'any_stack';

    const error = serverError(fakeError);

    const logSpy = jest.spyOn(logErrorRepository, 'log');

    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(error);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
