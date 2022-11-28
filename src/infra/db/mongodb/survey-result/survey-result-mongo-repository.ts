import { ObjectId } from 'mongodb';
import {
  SaveSurveyResultDTO,
  SaveSurveyResultRepository,
  SurveyResult,
} from '../../../../data/use-cases/save-survey-result/db-save-survey-result-protocols';
import MongoHelper from '../helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultDTO): Promise<SurveyResult> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'survey_result',
    );

    const { value }: any = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(data.surveyId),
        accountId: new ObjectId(data.accountId),
      },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    );

    const surveyResult: SurveyResult = {
      id: value._id.toString(),
      accountId: value.accountId.toString(),
      surveyId: value.surveyId.toString(),
      answer: value.answer,
      date: value.date,
    };

    return surveyResult;
  }
}
