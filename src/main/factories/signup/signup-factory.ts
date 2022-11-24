import { DbCreateAccount } from '../../../data/use-cases/create-account/db-create-account';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { SignUpController } from '../../../presentation/controllers/sign-up/sign-up-controller';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeSignUpValidation } from './signup-validation-factory';

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
