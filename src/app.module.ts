import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HighscoresModule } from './highscores/highscores.module';
import { GEModule } from './ge/ge.module';

@Module({
  imports: [HighscoresModule, GEModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
