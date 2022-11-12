import { Encrypter } from '../../protocols/encrypter';
import { DbCreateAccount } from './db-create-account';

interface SutTypes {
  sut: DbCreateAccount;
  encrypterStub: Encrypter;
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }

  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const sut = new DbCreateAccount(encrypterStub);

  return {
    sut,
    encrypterStub,
  };
};

describe('DbCreateAccount UseCase', () => {
  test('Should be able to call Encrypter with correct password', () => {
    const { encrypterStub, sut } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    sut.execute(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
