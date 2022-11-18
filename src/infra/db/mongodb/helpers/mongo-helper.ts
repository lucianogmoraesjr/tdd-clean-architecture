import { Collection, MongoClient } from 'mongodb';

class MongoHelper {
  client: MongoClient;

  constructor() {
    this.client = new MongoClient(
      process.env.NODE_ENV === 'test'
        ? 'mongodb://localhost:27017/test'
        : 'mongodb://localhost:27017/tdd-clean-architecture',
    );
  }

  async disconnect() {
    await this.client.close();
  }

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  }
}

export default new MongoHelper();
