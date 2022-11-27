import {
  badRequest,
  created,
  serverError,
} from '../../helpers/http/http-helper';
import {
  Controller,
  CreateSurvey,
  HttpRequest,
  HttpResponse,
  Validation,
} from './create-survey-controller-protocols';

export class CreateSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createSurvey: CreateSurvey,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { question, answers } = httpRequest.body;

      await this.createSurvey.create({ question, answers, date: new Date() });

      return created();
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
