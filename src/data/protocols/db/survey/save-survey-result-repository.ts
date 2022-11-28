import { SurveyResult } from '../../../../domain/entities/survey-result';
import { SaveSurveyResultDTO } from '../../../../domain/use-cases/save-survey-result';

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultDTO): Promise<SurveyResult>;
}
