/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */

const { MongoClient } = require('mongodb');

const CoinAPI = require('../CoinAPI');

class MongoBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.mongoUrl = 'mongodb://localhost:37017/maxcoin';
    this.client = null;
    this.collection = null;
  }

  async connect() {
    this.client = new MongoClient(this.mongoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    try {
      await this.client.connect();
      console.info('Successfully connected to MongoDB');
      this.collection = this.client.db('maxcoin').collection('values');
    } catch (error) {
      console.error('Connection to MongoDB failed', error);
      throw new Error('Connecting to MongoDB failed');
    }
  }

  async disconnect() {
    if (this.client) {
      try {
        await this.client.close();
        console.info('Disconnected successfully from MongoDB');
      } catch (error) {
        console.error('Disconnection from MongoDB failed', error);
      }
    }
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const documents = Object.entries(data.bpi).map(([date, value]) => ({ date, value }));
    try {
      const result = await this.collection.insertMany(documents);
      console.info(`Inserted ${result.insertedCount} documents into MongoDB`);
      return result;
    } catch (error) {
      console.error('Error inserting documents into MongoDB', error);
      throw error;
    }
  }

  async getMax() {
    try {
      return await this.collection.findOne({}, { sort: { value: -1 } });
    } catch (error) {
      console.error('Error finding the maximum value document', error);
      throw error;
    }
  }

  async max() {
    console.info('Connecting to MongoDB');
    console.time('mongodb-connect');

    await this.connect();

    console.timeEnd('mongodb-connect');

    console.info('Inserting into MongoDB');
    console.time('mongodb-insert');

    const insertResult = await this.insert();

    console.timeEnd('mongodb-insert');

    console.info('Querying MongoDB');
    console.time('mongodb-find');

    const doc = await this.getMax();

    console.timeEnd('mongodb-find');

    console.info('Disconnecting from MongoDB');
    console.time('mongodb-disconnect');

    await this.disconnect();

    console.timeEnd('mongodb-disconnect');

    return {
      date: doc.date,
      value: doc.value,
    };
  }
}

module.exports = MongoBackend;
