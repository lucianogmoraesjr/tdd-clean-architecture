import {
  SaveSurveyResultRepository,
  SaveSurveyResultDTO,
  SurveyResult,
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResultRepository {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
  ) {}

  async save(data: SaveSurveyResultDTO): Promise<SurveyResult> {
    const surveyResult = await this.saveSurveyResultRepository.save(data);
    return surveyResult;
  }
}
