import { Controller, Get, Query } from '@nestjs/common';
import { gim_highscoresService } from './gim_highscores.service';

@Controller('gim_highscores')
export class gim_highscoresController {
  constructor(private readonly gim_highscoresService: gim_highscoresService) {}

  @Get()
  async getOverall(@Query('page') page = 1, @Query('limit') limit = 25) {
    return await this.gim_highscoresService.get(page, limit);
  }

  @Get('/count')
  async getCount() {
    return await this.gim_highscoresService.getCount();
  }
}
