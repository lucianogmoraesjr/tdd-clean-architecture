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
  test('Should be able to call bcrypt hash with correct values', async () => {
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

  test('Should be able to throw if hash throws an exception', async () => {
    const bcryptHash = jest.fn().mockRejectedValue(new Error());
    (bcrypt.hash as jest.Mock) = bcryptHash;

    await expect(bcryptHash('any_value')).rejects.toThrow();
  });

  test('Should be able to call bcrypt compare with correct values', async () => {
    const sut = makeSut();

    const compareSpy = jest.spyOn(bcrypt, 'compare');

    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('Should be able to return true if compare passes', async () => {
    const sut = makeSut();

    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(true);
  });

  test('Should be able to return false if compare fails', async () => {
    const sut = makeSut();

    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementationOnce(() => Promise.resolve(false));

    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(false);
  });

  test('Should be able to throw if compare throws an exception', async () => {
    const bcryptCompare = jest.fn().mockRejectedValue(new Error());
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    await expect(bcryptCompare('any_value', 'any_hash')).rejects.toThrow();
  });
});
