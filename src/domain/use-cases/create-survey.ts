export interface SurveyAnswer {
  image?: string;
  answer: string;
}

export interface CreateSurveyDTO {
  question: string;
  answers: SurveyAnswer[];
  date: Date;
}

export interface CreateSurvey {
  create(data: CreateSurveyDTO): Promise<void>;
}
