import { DbCreateSurvey } from '../../../../data/use-cases/create-survey/db-create-survey';
import { CreateSurvey } from '../../../../domain/use-cases/create-survey';
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbCreateSurvey = (): CreateSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbCreateSurvey(surveyMongoRepository);
};
