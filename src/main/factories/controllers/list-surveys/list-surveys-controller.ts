import { ListSurveysController } from '../../../../presentation/controllers/list-surveys/list-surveys-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';
import { makeDbListSurveys } from '../../use-cases/list-surveys/db-list-surveys-factory';

export const makeListSurveysController = (): Controller => {
  return makeLogControllerDecorator(
    new ListSurveysController(makeDbListSurveys()),
  );
};
