import { Module } from '@nestjs/common';
import { WorldMongoDbModule } from 'src/mongo/world_mongodb.module';
import { HighscoresController } from './highscores.controller';
import { HighscoresService } from './highscores.service';

@Module({
  imports: [WorldMongoDbModule],
  controllers: [HighscoresController],
  providers: [HighscoresService],
})
export class HighscoresModule {}
