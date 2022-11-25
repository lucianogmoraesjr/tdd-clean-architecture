/* eslint-disable max-classes-per-file */
import { DbCreateAccount } from './db-create-account';
import {
  Account,
  CreateAccountDTO,
  Hasher,
  CreateAccountRepository,
  LoadAccountByEmailRepository,
} from './db-create-account-protocols';

const makeFakeAccount = (): Account => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password',
  };
};

const makeFakeAccountData = (): CreateAccountDTO => {
  return {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  };
};

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }

  return new HasherStub();
};

const makeCreateAccountRepositoryStub = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    create(account: CreateAccountDTO): Promise<Account> {
      return Promise.resolve(makeFakeAccount());
    }
  }

  return new CreateAccountRepositoryStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<Account | null> {
      return Promise.resolve(null);
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

interface SutTypes {
  sut: DbCreateAccount;
  hasherStub: Hasher;
  createAccountRepositoryStub: CreateAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub();
  const createAccountRepositoryStub = makeCreateAccountRepositoryStub();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbCreateAccount(
    hasherStub,
    createAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );

  return {
    sut,
    hasherStub,
    createAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbCreateAccount UseCase', () => {
  test('Should be able to call Hasher with correct password', async () => {
    const { hasherStub, sut } = makeSut();

    const encryptSpy = jest.spyOn(hasherStub, 'hash');

    await sut.execute(makeFakeAccountData());

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should be able to throw exception if Hasher throws', () => {
    const { hasherStub, sut } = makeSut();

    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error());

    expect(sut.execute(makeFakeAccountData())).rejects.toThrow();
  });

  test('Should be able to call CreateAccountRepository with correct values', async () => {
    const { createAccountRepositoryStub, sut } = makeSut();

    const createAccountRepositorySpy = jest.spyOn(
      createAccountRepositoryStub,
      'create',
    );

    await sut.execute(makeFakeAccountData());

    expect(createAccountRepositorySpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
    });
  });

  test('Should be able to throw if CreateAccountRepository throws', async () => {
    const { sut, createAccountRepositoryStub } = makeSut();

    jest
      .spyOn(createAccountRepositoryStub, 'create')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    await expect(sut.execute(makeFakeAccountData())).rejects.toThrow();
  });

  test('Should be able to return an account on success', async () => {
    const { sut } = makeSut();

    const newAccount = await sut.execute(makeFakeAccountData());

    expect(newAccount).toEqual(makeFakeAccount());
  });

  test('Should be able to call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    await sut.execute(makeFakeAccountData());

    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com');
  });

  test('Should be able to return null if LoadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(makeFakeAccount());

    const newAccount = await sut.execute(makeFakeAccountData());

    expect(newAccount).toBeNull();
  });
});
