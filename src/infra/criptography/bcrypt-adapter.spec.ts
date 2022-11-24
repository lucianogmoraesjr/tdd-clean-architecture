import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hashed_value');
  },

  async compare(): Promise<boolean> {
    return Promise.resolve(true);
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  test('Should be able to call bcrypt with correct values', async () => {
    const sut = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should be able to return a hashed value on success', async () => {
    const sut = makeSut();

    const hashedValue = await sut.hash('any_value');

    expect(hashedValue).toBe('hashed_value');
  });

  test('Should be able to call bcrypt with correct values', async () => {
    const sut = makeSut();

    const compareSpy = jest.spyOn(bcrypt, 'compare');

    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });
});
