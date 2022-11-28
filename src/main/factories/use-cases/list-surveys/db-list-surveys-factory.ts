import { DbListSurveys } from '../../../../data/use-cases/list-surveys/db-list-surveys';
import { ListSurveys } from '../../../../domain/use-cases/list-surveys';
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbListSurveys = (): ListSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbListSurveys(surveyMongoRepository);
};
