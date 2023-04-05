import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import { TemporalHiscoreService } from './temporal_hiscore.service';
import { CreateTemporalHiscoreDto } from "./dto/createTemporalHiscoreDto";
import { CreatePlayerTemporalHiscoreDto } from "./dto/createPlayerTemporalHiscoreDto";

@Controller('temporal')
export class TemporalController {
  constructor(private readonly temporalHiscoreService: TemporalHiscoreService) {}

  @Get()
  async getTotalTemporalHiscore(@Query('days-back') daysBack = 1, @Query('page') page = 1, @Query('limit') limit = 6, @Query('skill') skill = -1) {
    return await this.temporalHiscoreService.get(daysBack, page, limit, skill);
  }

  @Get('/player')
  async getPlayerTemporalHiscore(@Query('username') username = '', @Query('days') days = 1, @Query('page') page = 1, @Query('limit') limit = 6) {
    return await this.temporalHiscoreService.getPlayer(username, days, page, limit);
  }

}
