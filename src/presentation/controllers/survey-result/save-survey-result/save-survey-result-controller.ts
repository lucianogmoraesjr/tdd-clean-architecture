import { InvalidParamError } from '../../../errors';
import { forbidden, ok, serverError } from '../../../helpers/http/http-helper';
import {
  Controller,
  LoadSurveyById,
  HttpRequest,
  HttpResponse,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(
        httpRequest.params.surveyId,
      );

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      return ok(survey);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
