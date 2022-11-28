import { noContent, ok, serverError } from '../../helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  ListSurveys,
} from './list-surveys-controller-protocols';

export class ListSurveysController implements Controller {
  constructor(private readonly listSurveys: ListSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.listSurveys.list();

      if (!surveys.length) {
        return noContent();
      }

      return ok(surveys);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
