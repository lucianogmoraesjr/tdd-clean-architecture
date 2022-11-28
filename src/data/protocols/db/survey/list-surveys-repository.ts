import { Survey } from '../../../../domain/entities/survey';

export interface ListSurveysRepository {
  list(): Promise<Survey[]>;
}
