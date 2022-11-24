/* eslint-disable max-classes-per-file */

import { DbAuthentication } from './db-authentication';
import {
  Account,
  AuthenticationDTO,
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';

const makeFakeAccount = (): Account => {
  const account: Account = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password',
  };
  return account;
};

const makeFakeRequest = (): AuthenticationDTO => {
  return {
    email: 'any_email@mail.com',
    password: 'any_password',
  };
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async execute(email: string): Promise<Account | null> {
      return Promise.resolve(makeFakeAccount());
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async execute(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }

  return new HashComparerStub();
};

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async execute(id: string): Promise<string> {
      return Promise.resolve('any_token');
    }
  }

  return new TokenGeneratorStub();
};

const makeUpdateAcessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async execute(id: string, token: string): Promise<void> {
      return Promise.resolve();
    }
  }

  return new UpdateAccessTokenRepositoryStub();
};

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAcessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication', () => {
  test('Should be able to call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'execute');

    await sut.execute(makeFakeRequest());

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should be able to throw if LoadAccountByEmailRepository throws an exception', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'execute')
      .mockRejectedValueOnce(new Error());

    await expect(sut.execute(makeFakeRequest())).rejects.toThrow();
  });

  test('Should be able to return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'execute')
      .mockResolvedValueOnce(null);

    const accessToken = await sut.execute(makeFakeRequest());

    expect(accessToken).toBeNull();
  });

  test('Should be able to call HashComparer with correct value', async () => {
    const { sut, hashComparerStub } = makeSut();

    const comparerSpy = jest.spyOn(hashComparerStub, 'execute');

    await sut.execute(makeFakeRequest());

    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('Should be able to throw if HashComparer throws an exception', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, 'execute').mockRejectedValueOnce(new Error());

    await expect(sut.execute(makeFakeRequest())).rejects.toThrow();
  });

  test('Should be able to return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, 'execute').mockResolvedValueOnce(false);

    const accessToken = await sut.execute(makeFakeRequest());

    expect(accessToken).toBeNull();
  });

  test('Should be able to call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const generatorSpy = jest.spyOn(tokenGeneratorStub, 'execute');

    await sut.execute(makeFakeRequest());

    expect(generatorSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should be able to throw if TokenGenerator throws an exception', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    jest
      .spyOn(tokenGeneratorStub, 'execute')
      .mockRejectedValueOnce(new Error());

    await expect(sut.execute(makeFakeRequest())).rejects.toThrow();
  });

  test('Should be able to return an access token', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.execute(makeFakeRequest());
    expect(accessToken).toBe('any_token');
  });

  test('Should be able to call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'execute');

    await sut.execute(makeFakeRequest());

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  test('Should be able to throw if UpdateAccessTokenRepository throws an exception', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'execute')
      .mockRejectedValueOnce(new Error());

    await expect(sut.execute(makeFakeRequest())).rejects.toThrow();
  });
});
