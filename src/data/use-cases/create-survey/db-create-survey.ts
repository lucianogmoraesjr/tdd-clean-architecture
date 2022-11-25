import {
  CreateSurvey,
  CreateSurveyDTO,
} from '../../../domain/use-cases/create-survey';
import { CreateSurveyRepository } from './db-create-survey-protocols';

export class DbCreateSurvey implements CreateSurvey {
  constructor(
    private readonly createSurveyRepository: CreateSurveyRepository,
  ) {}

  async create(data: CreateSurveyDTO): Promise<void> {
    await this.createSurveyRepository.create(data);
  }
}
