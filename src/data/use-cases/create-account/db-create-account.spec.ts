/* eslint-disable max-classes-per-file */
import { DbCreateAccount } from './db-create-account';
import {
  Account,
  CreateAccountDTO,
  Hasher,
  CreateAccountRepository,
} from './db-create-account-protocols';

interface SutTypes {
  sut: DbCreateAccount;
  hasherStub: Hasher;
  createAccountRepositoryStub: CreateAccountRepository;
}

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
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
      };

      return Promise.resolve(fakeAccount);
    }
  }

  return new CreateAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub();
  const createAccountRepositoryStub = makeCreateAccountRepositoryStub();
  const sut = new DbCreateAccount(hasherStub, createAccountRepositoryStub);

  return {
    sut,
    hasherStub,
    createAccountRepositoryStub,
  };
};

describe('DbCreateAccount UseCase', () => {
  test('Should be able to call Hasher with correct password', async () => {
    const { hasherStub, sut } = makeSut();

    const encryptSpy = jest.spyOn(hasherStub, 'hash');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.execute(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should be able to throw exception if Hasher throws', () => {
    const { hasherStub, sut } = makeSut();

    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error());

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    expect(sut.execute(accountData)).rejects.toThrow();
  });

  test('Should be able to call CreateAccountRepository with correct values', async () => {
    const { createAccountRepositoryStub, sut } = makeSut();

    const createAccountRepositorySpy = jest.spyOn(
      createAccountRepositoryStub,
      'create',
    );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.execute(accountData);

    expect(createAccountRepositorySpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });

  test('Should be able to return an account on success', async () => {
    const { sut } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const newAccount = await sut.execute(accountData);

    expect(newAccount).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });
});
