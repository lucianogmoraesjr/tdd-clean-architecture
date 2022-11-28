import { ok } from '../../helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  ListSurveys,
} from './list-surveys-controller-protocols';

export class ListSurveysController implements Controller {
  constructor(private readonly listSurveys: ListSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.listSurveys.list();
    return ok(surveys);
  }
}
