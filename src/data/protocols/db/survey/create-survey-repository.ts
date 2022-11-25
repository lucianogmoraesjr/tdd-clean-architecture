import { CreateSurveyDTO } from '../../../../domain/use-cases/create-survey';

export interface CreateSurveyRepository {
  create(surveyData: CreateSurveyDTO): Promise<void>;
}
