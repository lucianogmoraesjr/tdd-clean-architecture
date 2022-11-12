import { DbCreateAccount } from './db-create-account';

describe('DbCreateAccount UseCase', () => {
  test('Should be able to call Encrypter with correct password', () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return Promise.resolve('hashed_password');
      }
    }

    const encrypterStub = new EncrypterStub();

    const sut = new DbCreateAccount(encrypterStub);

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
