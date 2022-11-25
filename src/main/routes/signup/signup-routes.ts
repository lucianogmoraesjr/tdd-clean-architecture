import { Router } from 'express';
import { adaptRoute } from '../../adapters/express/express-routes-adapter';
import { makeSignUpController } from '../../factories/controllers/signup/signup-controller-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
};
