import { badRequest, ok } from '../../helpers/http/http-helper';
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
    const error = this.validation.validate(httpRequest.body);

    if (error) {
      return badRequest(error);
    }

    const { question, answers } = httpRequest.body;

    await this.createSurvey.create({ question, answers });

    return ok({ ok: 'ok' });
  }
}
