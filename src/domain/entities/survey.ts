export interface Survey {
  id: string;
  question: string;
  answers: SurveyAnswer[];
  date: Date;
}

export interface SurveyAnswer {
  image?: string;
  answer: string;
}
