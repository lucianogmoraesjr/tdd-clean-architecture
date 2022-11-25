import { Validation } from '../../../../presentation/protocols/validation';
import {
  ValidationComposite,
  RequiredFieldValidation,
} from '../../../../validations/validators';

export const makeCreateSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = [];

  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
