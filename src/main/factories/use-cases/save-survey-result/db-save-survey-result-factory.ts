import { DbSaveSurveyResult } from '../../../../data/use-cases/save-survey-result/db-save-survey-result';
import { SaveSurveyResult } from '../../../../domain/use-cases/save-survey-result';
import { SurveyResultMongoRepository } from '../../../../infra/db/mongodb/survey-result/survey-result-mongo-repository';

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(surveyResultMongoRepository);
};
