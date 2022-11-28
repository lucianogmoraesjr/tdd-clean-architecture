import { Survey } from '../entities/survey';

export interface ListSurveys {
  list(): Promise<Survey[]>;
}
