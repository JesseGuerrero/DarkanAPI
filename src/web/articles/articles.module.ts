import { Module } from '@nestjs/common';
import { WorldMongoDbModule } from 'src/mongo/world_mongodb.module';
import { ArticlesController } from './web.controller';
import { ArticlesService, TitleExistsRule } from './web.service';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule, WorldMongoDbModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, TitleExistsRule],
})
export class ArticlesModule {}
