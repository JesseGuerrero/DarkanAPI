import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from '../../config';
import { JwtStrategy } from './jwt.strategy';
import { AccountsService } from 'src/accounts/accounts.service';
import { LobbyMongoDbModule } from 'src/mongo/lobby_mongodb.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    LobbyMongoDbModule,
    PassportModule,
    JwtModule.register({
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: '48h' },
    }),
  ],
  providers: [AccountsService, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
