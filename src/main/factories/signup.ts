import { DbCreateAccount } from '../../data/use-cases/create-account/db-create-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { SignUpController } from '../../presentation/controllers/sign-up/sign-up';
import { Controller } from '../../presentation/protocols';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/log';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const brcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbCreateAccount = new DbCreateAccount(
    brcryptAdapter,
    accountMongoRepository,
  );
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbCreateAccount,
  );
  return new LogControllerDecorator(signUpController);
};
