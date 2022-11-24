import { Router } from 'express';
import { adaptRoute } from '../../adapters/express/express-routes-adapter';
import { makeLoginController } from '../../factories/login/login-factory';

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()));
};
