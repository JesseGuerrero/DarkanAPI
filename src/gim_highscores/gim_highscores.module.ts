import { Module } from '@nestjs/common';
import { WorldMongoDbModule } from 'src/mongo/world_mongodb.module';
import { gim_highscoresController } from './gim_highscores.controller';
import { gim_highscoresService } from './gim_highscores.service';

@Module({
  imports: [WorldMongoDbModule],
  controllers: [gim_highscoresController],
  providers: [gim_highscoresService],
})
export class gim_highscoresModule {}
