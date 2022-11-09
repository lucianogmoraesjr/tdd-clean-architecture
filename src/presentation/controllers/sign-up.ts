export class SignUpController {
  // eslint-disable-next-line no-unused-vars
  handle(httpRequest: any): any {
    return {
      statusCode: 400,
      body: new Error('Missing param: name'),
    };
  }
}
