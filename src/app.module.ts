import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HighscoresModule } from './highscores/highscores.module';
import { GEModule } from './ge/ge.module';
import { gim_highscoresModule } from "./gim_highscores/gim_highscores.module";

@Module({
  imports: [HighscoresModule, GEModule, gim_highscoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
