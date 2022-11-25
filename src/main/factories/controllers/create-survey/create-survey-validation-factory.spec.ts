import { Validation } from '../../../../presentation/protocols/validation';
import { makeCreateSurveyValidation } from './create-survey-validation-factory';
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../validations/validators';

jest.mock('../../../../validations/validators/validation-composite');

describe('LoginValidation Factory', () => {
  test('Should be able to call ValidationComposite with all validations', () => {
    makeCreateSurveyValidation();

    const validations: Validation[] = [];

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
