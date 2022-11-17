import request from 'supertest';
import app from '../config/app';

describe('SignUp Routes', () => {
  test('Should be able to return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'John',
        email: 'john@mail.com',
        password: '123',
        passwordConfirmation: '123',
      })
      .expect(200);
  });
});
