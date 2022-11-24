/* eslint-disable max-classes-per-file */
import { Account } from '../../../domain/entities/account';
import { AuthenticationDTO } from '../../../domain/use-cases/authentication';
import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { TokenGenerator } from '../../protocols/cryptography/token-generator';
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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async execute(id: string): Promise<string> {
      return Promise.resolve('any_token');
    }
  }

  return new TokenGeneratorStub();
};

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
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
});
