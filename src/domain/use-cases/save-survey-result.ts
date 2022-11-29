import { SurveyResult } from '../entities/survey-result';

export interface SaveSurveyResultDTO {
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
}

export interface SaveSurveyResult {
  save(data: SaveSurveyResultDTO): Promise<SurveyResult>;
}
