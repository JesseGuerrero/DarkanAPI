import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import { TemporalHiscoreService } from './temporal_hiscore.service';
import { CreateTemporalHiscoreDto } from "./dto/createTemporalHiscoreDto";
import { CreatePlayerTemporalHiscoreDto } from "./dto/createPlayerTemporalHiscoreDto";

@Controller('temporal')
export class TemporalController {
  constructor(private readonly temporalHiscoreService: TemporalHiscoreService) {}

  @Post('delete/:day')
  async delete(@Param('day') day : Number) {
    return this.temporalHiscoreService.delete(day)
  }

  @Post('delete-players/:day')
  async deletePlayers(@Param('day') day : Number) {
    return this.temporalHiscoreService.deletePlayers(day)
  }

  @Post('create-today')
  async create(@Body() temporalHiscore : CreateTemporalHiscoreDto) {
    return this.temporalHiscoreService.create(temporalHiscore);
  }

  @Post('create-player')
  async createPlayer(@Body() temporalHiscorePlayer : CreatePlayerTemporalHiscoreDto) {
    return this.temporalHiscoreService.createPlayer(temporalHiscorePlayer);
  }

  @Get()
  async getTotalTemporalHiscore(@Query('days') days = 1, @Query('page') page = 1, @Query('limit') limit = 6, @Query('type') type = 0) {
    return await this.temporalHiscoreService.get(days, page, limit, type);
  }

  @Get()
  async getPlayerTemporalHiscore(@Query('username') username = '', @Query('days') days = 1, @Query('page') page = 1, @Query('limit') limit = 6) {
    return await this.temporalHiscoreService.getPlayer(username, days, page, limit);
  }

  @Get('/count')
  async getCount() {
    return await this.temporalHiscoreService.getCount();
  }
}
