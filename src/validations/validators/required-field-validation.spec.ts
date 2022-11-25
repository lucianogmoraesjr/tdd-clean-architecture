import { MissingParamError } from '../../presentation/errors';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  test('Should be able to return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field');
    const error = sut.validate({ name: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should not be able to return if validation pass', () => {
    const sut = new RequiredFieldValidation('field');
    const error = sut.validate({ field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
