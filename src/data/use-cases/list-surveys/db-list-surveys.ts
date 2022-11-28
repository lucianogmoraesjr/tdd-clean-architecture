import { Survey } from '../../../domain/entities/survey';
import { ListSurveys } from '../../../domain/use-cases/list-surveys';
import { ListSurveysRepository } from '../../protocols/db/survey/list-surveys-repository';

export class DbListSurveys implements ListSurveys {
  constructor(private readonly listSurveysRepository: ListSurveysRepository) {}

  async list(): Promise<Survey[]> {
    const surveys = await this.listSurveysRepository.list();

    return surveys;
  }
}
