import { Router } from 'express';
import { adaptMiddleware } from '../../adapters/express/express-middleware-adapter';
import { adaptRoute } from '../../adapters/express/express-routes-adapter';
import { makeCreateSurveyController } from '../../factories/controllers/create-survey/create-survey-controller-factory';
import { makeListSurveysController } from '../../factories/controllers/list-surveys/list-surveys-controller';
import { makeAuthMiddleware } from '../../factories/middlewares/auth-middleware-factory';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
  const auth = adaptMiddleware(makeAuthMiddleware());
  router.post('/survey', adminAuth, adaptRoute(makeCreateSurveyController()));
  router.get('/survey', auth, adaptRoute(makeListSurveysController()));
};
