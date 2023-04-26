import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import { TemporalHiscoreService } from './temporal_hiscore.service';
import { CreateTemporalHiscoreDto } from "./dto/createTemporalHiscoreDto";
import { CreatePlayerTemporalHiscoreDto } from "./dto/createPlayerTemporalHiscoreDto";
import {first} from "rxjs";

@Controller('temporal')
export class TemporalController {
  constructor(private readonly temporalHiscoreService: TemporalHiscoreService) {}

  @Get()
  async getTotalTemporalHiscore(@Query('firstDayPast') firstDayPast = 0, @Query('secondDayPast') secondDayPast = 1, @Query('page') page = 1, @Query('limit') limit = 6, @Query('skill') skill = -1) {
    return await this.temporalHiscoreService.get(firstDayPast, secondDayPast, page, limit, skill);
  }

  @Get('/player')
  async getPlayerTemporalHiscore(@Query('firstDayPast') firstDayPast = 0, @Query('secondDayPast') secondDayPast = 1,@Query('username') username = '') {
    return await this.temporalHiscoreService.getPlayer(firstDayPast, secondDayPast, username);
  }

}
