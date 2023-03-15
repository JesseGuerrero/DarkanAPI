import { Module } from '@nestjs/common';
import { WorldMongoDbModule } from 'src/mongo/world_mongodb.module';
import { WebController } from './web.controller';
import { WebService, TitleExistsRule } from './web.service';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule, WorldMongoDbModule],
  controllers: [WebController],
  providers: [WebService, TitleExistsRule],
})
export class WebModule {}
