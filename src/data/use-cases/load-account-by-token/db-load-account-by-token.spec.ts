/* eslint-disable max-classes-per-file */
import { Account } from '../../../domain/entities/account';
import { Decrypter } from '../../protocols/cryptography/decrypter';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';
import { DbLoadAccountByToken } from './db-load-account-by-token';

const makeFakeAccount = (): Account => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
});

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string | null> {
      return Promise.resolve('any_value');
    }
  }

  return new DecrypterStub();
};

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(token: string, role?: string): Promise<Account> {
      return Promise.resolve(makeFakeAccount());
    }
  }

  return new LoadAccountByTokenRepositoryStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  );

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  };
};

describe('DbLoadAccountByToken UseCase', () => {
  test('Should be able to call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

    await sut.load('any_token');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should be able to return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null);

    const httpResponse = await sut.load('any_token');

    expect(httpResponse).toBeNull();
  });

  test('Should be able to call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken',
    );

    await sut.load('any_token', 'any_role');

    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  test('Should be able to return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockResolvedValueOnce(null);

    const httpResponse = await sut.load('any_token');

    expect(httpResponse).toBeNull();
  });

  test('Should be able to return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.load('any_token');

    expect(account).toEqual(makeFakeAccount());
  });

  test('Should be able to throw if Decrypter throws an exception', async () => {
    const { sut, decrypterStub } = makeSut();

    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error());

    await expect(sut.load('any_token', 'any_role')).rejects.toThrow();
  });

  test('Should be able to throw if LoadAccountByTokenRepositoryStub throws an exception', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockRejectedValueOnce(new Error());

    await expect(sut.load('any_token', 'any_role')).rejects.toThrow();
  });
});
