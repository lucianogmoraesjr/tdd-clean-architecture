import { Collection, MongoClient } from 'mongodb';

class MongoHelper {
  client: MongoClient;

  constructor() {
    this.client = new MongoClient('mongodb://localhost:27017');
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.close();
  }

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  }
}

export default new MongoHelper();
