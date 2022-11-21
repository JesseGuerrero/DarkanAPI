import { MongoClient } from 'mongodb';
import * as config from '../../config';
import { LOBBY_MONGODB_PROVIDER } from 'src/constants';

export const lobbyMongoDbProviders = [
  {
    provide: LOBBY_MONGODB_PROVIDER,
    useFactory: async () => new Promise((resolve, reject) => {
      MongoClient.connect(config.WORLD_MONGO_CONN_URI,
      (error, client) => {
        if (error) {
          reject(error);
        } else {
          resolve(client.db(config.WORLD_MONGO_DATABASE));
        }
      });
    })
  },
];