/* eslint-disable max-classes-per-file */
import { DbCreateAccount } from './db-create-account';
import {
  Account,
  CreateAccountDTO,
  Encrypter,
  CreateAccountRepository,
} from './db-create-account-protocols';

interface SutTypes {
  sut: DbCreateAccount;
  encrypterStub: Encrypter;
  createAccountRepositoryStub: CreateAccountRepository;
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }

  return new EncrypterStub();
};

const makeCreateAccountRepositoryStub = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    execute(account: CreateAccountDTO): Promise<Account> {
      const fakeAcount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
      };

      return Promise.resolve(fakeAcount);
    }
  }

  return new CreateAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const createAccountRepositoryStub = makeCreateAccountRepositoryStub();
  const sut = new DbCreateAccount(encrypterStub, createAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    createAccountRepositoryStub,
  };
};

describe('DbCreateAccount UseCase', () => {
  test('Should be able to call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.execute(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should be able to throw exception if Encrypter throws', () => {
    const { encrypterStub, sut } = makeSut();

    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error());

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
      'execute',
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

  test('Should be able to throw exception if CreateAccountRepository throws', () => {
    const { createAccountRepositoryStub, sut } = makeSut();

    jest
      .spyOn(createAccountRepositoryStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    expect(sut.execute(accountData)).rejects.toThrow();
  });
});
