import { Module } from '@nestjs/common';
import { lobbyMongoDbProviders } from './lobby_mongodb.provider';

@Module({
  providers: [...lobbyMongoDbProviders],
  exports: [...lobbyMongoDbProviders],
})
export class LobbyMongoDbModule {

}