import { MongoClient } from 'mongodb';
import { config } from '../../config';

export const mongoDbProviders = [
  {
    provide: config.MONGODB_PROVIDER,
    useFactory: async () => new Promise((resolve, reject) => {
      MongoClient.connect(config.MONGO_CONN_URI,
      (error, client) => {
        if (error) {
          reject(error);
        } else {
          resolve(client.db(config.MONGO_DATABASE));
        }
      });
    })
  },
];