import { CreateSurveyController } from '../../../../presentation/controllers/create-survey/create-survey-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';
import { makeDbCreateSurvey } from '../../use-cases/create-survey/db-create-survey-factory';
import { makeCreateSurveyValidation } from './create-survey-validation-factory';

export const makeCreateSurveyController = (): Controller => {
  return makeLogControllerDecorator(
    new CreateSurveyController(
      makeCreateSurveyValidation(),
      makeDbCreateSurvey(),
    ),
  );
};
