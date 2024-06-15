/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */

const { MongoClient } = require('mongodb');
const CoinAPI = require('../CoinAPI');

class MongoBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.url = 'mongodb://localhost:37017/maxcoin';
    this.client = new MongoClient(this.url, {
      useUnifiedTopology: true,
      newUrlParser: true,
    });

    this.collection = null;
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected successfully to server');
      this.db = this.client.db(this.dbName);
    } catch (err) {
      console.error('Connection failed', err);
      throw err;
    }
  }

  async disconnect() {
        try {
      await this.client.close();
      console.log('Disconnected successfully from server');
    } catch (err) {
      console.error('Disconnection failed', err);
      throw err;
    }
  }

  async insert() {}

  async getMax() {}

  async max() {
    try {
      const collection = this.db.collection(collectionName);
      const documents = await collection.find({}).toArray();
      return documents;
    } catch (err) {
      console.error('Error finding documents', err);
      throw err;
    }
  }
}

module.exports = MongoBackend;
