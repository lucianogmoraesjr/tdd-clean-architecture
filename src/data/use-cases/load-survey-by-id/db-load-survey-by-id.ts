import { Survey } from '../../../domain/entities/survey';
import { LoadSurveyById } from '../../../domain/use-cases/load-survey-by-id';
import { LoadSurveyByIdRepository } from '../../protocols/db/survey/load-survey-by-id-repository';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async loadById(id: string): Promise<Survey> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}
