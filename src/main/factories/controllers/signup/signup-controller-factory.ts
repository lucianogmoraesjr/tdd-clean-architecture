import { SignUpController } from '../../../../presentation/controllers/sign-up/sign-up-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';
import { makeDbAuthentication } from '../../use-cases/authentication/db-authentication-factory';
import { makeDbCreateAccount } from '../../use-cases/create-account/db-create-account-factory';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(
    new SignUpController(
      makeDbCreateAccount(),
      makeSignUpValidation(),
      makeDbAuthentication(),
    ),
  );
};
