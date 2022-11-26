import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },

  async verify(): Promise<string> {
    return 'any_data';
  },
}));

interface SutTypes {
  sut: JwtAdapter;
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('secret');
  return {
    sut,
  };
};

describe('JWT Adapter', () => {
  test('Should be able to call sign with correct values', async () => {
    const { sut } = makeSut();

    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });

  test('Should be able to return an access token on sign success', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.encrypt('any_id');
    expect(accessToken).toBe('any_token');
  });

  test('Should be able to throw if sign throws an exception', async () => {
    const { sut } = makeSut();

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.encrypt('any_id')).rejects.toThrow();
  });

  test('Should be able to call verify with correct values', async () => {
    const { sut } = makeSut();
    const verifySpy = jest.spyOn(jwt, 'verify');
    await sut.decrypt('any_token');
    expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
  });

  test('Should be able to return an access token on sign success', async () => {
    const { sut } = makeSut();
    const data = await sut.decrypt('any_token');
    expect(data).toBe('any_data');
  });
});
