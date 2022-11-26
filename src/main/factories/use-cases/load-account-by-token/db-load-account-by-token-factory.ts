import { DbLoadAccountByToken } from '../../../../data/use-cases/load-account-by-token/db-load-account-by-token';
import { LoadAccountByToken } from '../../../../domain/use-cases/load-account-by-token';
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtSecret = 'teste123';
  const jwtAdapter = new JwtAdapter(jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
