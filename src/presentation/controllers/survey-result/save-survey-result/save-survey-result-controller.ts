import { SaveSurveyResult } from '../../../../domain/use-cases/save-survey-result';
import { InvalidParamError, UnauthorizedError } from '../../../errors';
import {
  forbidden,
  ok,
  serverError,
  unauthorized,
} from '../../../helpers/http/http-helper';
import {
  Controller,
  LoadSurveyById,
  HttpRequest,
  HttpResponse,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const { accountId } = httpRequest;

      const survey = await this.loadSurveyById.loadById(surveyId);

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const answers = survey.answers.map(answerMap => answerMap.answer);

      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'));
      }

      await this.saveSurveyResult.save({
        accountId: accountId || '',
        surveyId,
        answer,
        date: new Date(),
      });

      return ok(survey);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
