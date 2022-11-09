import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from './errors/missing-param-error';

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const fieldName of requiredFields) {
      if (!httpRequest.body[fieldName]) {
        return badRequest(new MissingParamError(fieldName));
      }
    }

    return {
      statusCode: 200,
      body: 'ok',
    };
  }
}
