import {
  CreateSurveyDTO,
  CreateSurveyRepository,
} from '../../../../data/use-cases/create-survey/db-create-survey-protocols';
import MongoHelper from '../helpers/mongo-helper';

export class SurveyMongoRepository implements CreateSurveyRepository {
  async create(surveyData: CreateSurveyDTO): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }
}
