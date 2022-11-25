import { DbCreateAccount } from '../../../../data/use-cases/create-account/db-create-account';
import { CreateAccount } from '../../../../domain/use-cases/create-account';
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';

export const makeDbCreateAccount = (): CreateAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbCreateAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository,
  );
};
