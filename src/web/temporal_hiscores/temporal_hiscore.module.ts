import { Module } from '@nestjs/common';
import { WorldMongoDbModule } from 'src/mongo/world_mongodb.module';
import { TemporalController } from './temporal_hiscore.controller';
import { TemporalHiscoreService, TitleExistsRule } from './temporal_hiscore.service';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule, WorldMongoDbModule],
  controllers: [TemporalController],
  providers: [TemporalHiscoreService, TitleExistsRule],
})
export class ArticlesModule {}
