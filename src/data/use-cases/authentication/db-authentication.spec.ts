/* eslint-disable max-classes-per-file */
import { Account } from '../../../domain/entities/account';
import { AuthenticationDTO } from '../../../domain/use-cases/authentication';
import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

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

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
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
});
