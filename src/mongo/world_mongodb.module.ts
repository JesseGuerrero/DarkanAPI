import { Module } from '@nestjs/common';
import { worldMongoDbProviders } from './world_mongodb.provider';

@Module({
  providers: [...worldMongoDbProviders],
  exports: [...worldMongoDbProviders],
})
export class WorldMongoDbModule {

}