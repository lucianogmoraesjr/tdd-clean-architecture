import { CreateAccount } from '../../../domain/use-cases/create-account';
import { badRequest, ok, serverError } from '../../helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { Validation } from './sign-up-protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly createAccount: CreateAccount,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.createAccount.execute({
        name,
        email,
        password,
      });

      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
