import { DbCreateAccount } from '../../../data/use-cases/create-account/db-create-account';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log';
import { SignUpController } from '../../../presentation/controllers/sign-up/sign-up';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbCreateAccount = new DbCreateAccount(
    bcryptAdapter,
    accountMongoRepository,
  );
  const signUpController = new SignUpController(
    dbCreateAccount,
    makeSignUpValidation(),
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
