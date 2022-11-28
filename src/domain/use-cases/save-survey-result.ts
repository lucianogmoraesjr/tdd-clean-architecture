import { SurveyResult } from '../entities/survey-result';

export interface SaveSurveyResultDTO {
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
}

export interface CreateSurvey {
  create(data: SaveSurveyResultDTO): Promise<SurveyResult>;
}
