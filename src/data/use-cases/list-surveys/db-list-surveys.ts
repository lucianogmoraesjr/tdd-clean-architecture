import {
  ListSurveys,
  ListSurveysRepository,
  Survey,
} from './db-list-surveys-protocols';

export class DbListSurveys implements ListSurveys {
  constructor(private readonly listSurveysRepository: ListSurveysRepository) {}

  async list(): Promise<Survey[]> {
    const surveys = await this.listSurveysRepository.list();

    return surveys;
  }
}
