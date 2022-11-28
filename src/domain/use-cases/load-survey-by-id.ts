import { Survey } from '../entities/survey';

export interface LoadSurveyById {
  loadById(id: string): Promise<Survey>;
}
