import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../sign-up/sign-up-protocols';

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')));
    }

    if (!httpRequest.body.password) {
      return Promise.resolve(badRequest(new MissingParamError('password')));
    }

    this.emailValidator.isValid(httpRequest.body.email);

    return Promise.resolve({
      statusCode: 200,
      body: 'ok',
    });
  }
}
