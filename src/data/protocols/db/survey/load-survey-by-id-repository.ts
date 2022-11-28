import { Survey } from '../../../../domain/entities/survey';

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<Survey>;
}
