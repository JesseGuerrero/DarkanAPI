import { Module } from '@nestjs/common';
import { WorldMongoDbModule } from 'src/mongo/world_mongodb.module';
import { GEController } from './ge.controller';
import { GEService } from './ge.service';

@Module({
  imports: [WorldMongoDbModule],
  controllers: [GEController],
  providers: [GEService],
})
export class GEModule {}
