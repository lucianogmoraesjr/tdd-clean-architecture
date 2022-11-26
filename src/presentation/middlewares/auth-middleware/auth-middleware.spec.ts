import { Account } from '../../../domain/entities/account';
import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token';
import { AccessDeniedError } from '../../errors';
import { forbidden } from '../../helpers/http/http-helper';
import { HttpRequest } from '../../protocols';
import { AuthMiddleware } from './auth-middleware';

const makeFakeAccount = (): Account => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(
      accessToken: string,
      role?: string | undefined,
    ): Promise<Account | null> {
      return Promise.resolve(makeFakeAccount());
    }
  }

  return new LoadAccountByTokenStub();
};

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);

  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe('Auth Middleware', () => {
  test('Should be able to return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should be able to call LoadAccountByToken with correct access token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

    await sut.handle(makeFakeRequest());

    expect(loadSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should be able to return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null);

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
