import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hashed_value');
  },
}));

describe('Bcrypt Adapter', () => {
  test('Should be able to call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should be able to return a hashed value on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    const hashedValue = await sut.encrypt('any_value');

    expect(hashedValue).toBe('hashed_value');
  });
});
