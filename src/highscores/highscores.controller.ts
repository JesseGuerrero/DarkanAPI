import { Controller, Get, Query } from '@nestjs/common';
import { HighscoresService } from './highscores.service';

@Controller('highscores')
export class HighscoresController {
  constructor(private readonly highscoresService: HighscoresService) {}

  @Get()
  async getOverall(@Query('page') page = 1, @Query('limit') limit = 25, @Query('gamemode') gamemode = 'all', @Query('skill') skill = -1) {
    return await this.highscoresService.get(page, limit, gamemode, skill);
  }

  @Get('/count')
  async getCount() {
    return await this.highscoresService.getCount();
  }
}
