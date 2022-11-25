import { Router } from 'express';
import { adaptRoute } from '../../adapters/express/express-routes-adapter';
import { makeLoginController } from '../../factories/controllers/login/login-controller-factory';

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()));
};
