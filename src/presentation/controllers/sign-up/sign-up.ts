import { CreateAccount } from '../../../domain/use-cases/create-account';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { EmailValidator } from './sign-up-protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly createAccount: CreateAccount,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.createAccount.execute({
        name,
        email,
        password,
      });

      return ok(account);
    } catch {
      return serverError();
    }
  }
}
