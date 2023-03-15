import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './players/players.module';
import { HighscoresModule } from './highscores/highscores.module';
import { GEModule } from './ge/ge.module';
import { WebModule } from './web/web.module';

@Module({
  imports: [
    GEModule,
    HighscoresModule,
    PlayersModule,
    WebModule,
    AccountsModule,
    LogsModule,
    AuthModule
  ]
})
export class AppModule {}
