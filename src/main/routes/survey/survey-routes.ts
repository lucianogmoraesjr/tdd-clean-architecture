import { Router } from 'express';
import { adaptRoute } from '../../adapters/express/express-routes-adapter';
import { makeCreateSurveyController } from '../../factories/controllers/create-survey/create-survey-controller-factory';
import { makeListSurveysController } from '../../factories/controllers/list-surveys/list-surveys-controller';
import { adminAuth } from '../../middlewares/admin-auth';
import { auth } from '../../middlewares/auth';

export default (router: Router): void => {
  router.post('/survey', adminAuth, adaptRoute(makeCreateSurveyController()));
  router.get('/survey', auth, adaptRoute(makeListSurveysController()));
};
