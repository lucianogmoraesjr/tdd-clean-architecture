import { Decrypter } from '../../protocols/cryptography/decrypter';
import { DbLoadAccountByToken } from './db-load-account-by-token';

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return Promise.resolve('any_value');
    }
  }

  return new DecrypterStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);

  return {
    sut,
    decrypterStub,
  };
};

describe('DbLoadAccountByToken UseCase', () => {
  test('Should be able to call Decrypter with', async () => {
    const { sut, decrypterStub } = makeSut();

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

    await sut.load('any_token');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
});
