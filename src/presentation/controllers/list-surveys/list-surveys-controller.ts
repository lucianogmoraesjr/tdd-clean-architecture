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
    await this.listSurveys.list();
    return ok({ ok: 'ok' });
  }
}
