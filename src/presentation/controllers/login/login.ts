import { Authentication } from '../../../domain/use-cases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import {
  badRequest,
  serverError,
  unauthorized,
} from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../sign-up/sign-up-protocols';

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      if (!email) {
        return Promise.resolve(badRequest(new MissingParamError('email')));
      }

      if (!password) {
        return Promise.resolve(badRequest(new MissingParamError('password')));
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isEmailValid) {
        return Promise.resolve(badRequest(new InvalidParamError('email')));
      }

      const accessToken = await this.authentication.execute(email, password);

      if (!accessToken) {
        return unauthorized();
      }

      return Promise.resolve({
        statusCode: 200,
        body: 'ok',
      });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
