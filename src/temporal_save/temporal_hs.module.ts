import { PORT } from "../constants"
import { HttpModule } from "@nestjs/axios";
import { WorldMongoDbModule } from 'src/mongo/world_mongodb.module';
import { Temporal_HSService } from "./temporal_hs.service";
import { Module } from "@nestjs/common";
import { TemporalHSController } from "./temporal_hs.controller";
import { HighscoresService } from "../highscores/highscores.service";

@Module({
  imports: [HttpModule, WorldMongoDbModule],
  controllers: [TemporalHSController],
  providers: [Temporal_HSService, HighscoresService],
})
export class Temporal_HSModule {}
