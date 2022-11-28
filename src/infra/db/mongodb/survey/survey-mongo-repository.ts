import { ListSurveysRepository } from '../../../../data/protocols/db/survey/list-surveys-repository';
import {
  CreateSurveyDTO,
  CreateSurveyRepository,
} from '../../../../data/use-cases/create-survey/db-create-survey-protocols';
import { Survey } from '../../../../domain/entities/survey';
import MongoHelper from '../helpers/mongo-helper';

export class SurveyMongoRepository
  implements CreateSurveyRepository, ListSurveysRepository
{
  async create(surveyData: CreateSurveyDTO): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async list(): Promise<Survey[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveysMongoResult = await surveyCollection.find().toArray();

    const surveys: Survey[] = [];

    for (const survey of surveysMongoResult) {
      const { _id, ...rest } = survey as any;

      const mappedSurvey: Survey = {
        ...rest,
        id: _id.toString(),
      };

      surveys.push(mappedSurvey);
    }

    return surveys;
  }
}
