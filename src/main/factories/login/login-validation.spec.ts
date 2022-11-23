import { EmailValidator } from '../../../presentation/protocols/email-validator';
import { Validation } from '../../../presentation/protocols/validation';
import { makeLoginValidation } from './login-validation';
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('LoginValidation Factory', () => {
  test('Should be able to call ValidationComposite with all validations', () => {
    makeLoginValidation();

    const validations: Validation[] = [];

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation('email', makeEmailValidatorStub()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
