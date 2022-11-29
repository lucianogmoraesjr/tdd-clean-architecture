import { ok } from '../../../helpers/http/http-helper';
import {
  Controller,
  LoadSurveyById,
  HttpRequest,
  HttpResponse,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(
      httpRequest.params.surveyId,
    );

    return ok(survey);
  }
}
