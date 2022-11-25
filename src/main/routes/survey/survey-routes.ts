import { Router } from 'express';
import { adaptRoute } from '../../adapters/express/express-routes-adapter';
import { makeCreateSurveyController } from '../../factories/controllers/create-survey/create-survey-controller-factory';

export default (router: Router): void => {
  router.post('/survey', adaptRoute(makeCreateSurveyController()));
};
