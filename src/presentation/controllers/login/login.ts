import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../sign-up/sign-up-protocols';

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

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

      return Promise.resolve({
        statusCode: 200,
        body: 'ok',
      });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
