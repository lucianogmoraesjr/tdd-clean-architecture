import { EmailValidator } from '../../../presentation/protocols/email-validator';
import { Validation } from '../../../presentation/protocols/validation';
import { makeSignUpValidation } from './signup-validation';
import {
  RequiredFieldValidation,
  CompareFieldValidation,
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

describe('SignUpValidation Factory', () => {
  test('Should be able to call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const validations: Validation[] = [];

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(
      new CompareFieldValidation('password', 'passwordConfirmation'),
    );

    validations.push(new EmailValidation('email', makeEmailValidatorStub()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
