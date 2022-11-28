import { SurveyAnswer } from '../entities/survey';

export interface CreateSurveyDTO {
  question: string;
  answers: SurveyAnswer[];
  date: Date;
}

export interface CreateSurvey {
  create(data: CreateSurveyDTO): Promise<void>;
}
