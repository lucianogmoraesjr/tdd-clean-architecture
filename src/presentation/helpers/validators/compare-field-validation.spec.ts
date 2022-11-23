import { InvalidParamError } from '../../errors';
import { CompareFieldValidation } from './compare-field-validation';

describe('RequiredField Validation', () => {
  test('Should be able to return a InvalidParamError if validation fails', () => {
    const sut = new CompareFieldValidation('field', 'fieldToCompare');
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value',
    });
    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  test('Should not be able to return if validation pass', () => {
    const sut = new CompareFieldValidation('field', 'fieldToCompare');
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });
    expect(error).toBeFalsy();
  });
});
