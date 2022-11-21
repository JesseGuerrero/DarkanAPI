import { Controller, Get, Query } from '@nestjs/common';
import { GEService } from './ge.service';

@Controller('ge')
export class GEController {
  constructor(private readonly geService: GEService) {}

  @Get()
  async getAllOffers(@Query('page') page = 1, @Query('limit') limit = 25) {
    return await this.geService.getAllOffers(page, limit);
  }

  @Get('buy')
  async getAllBuys(@Query('page') page = 1, @Query('limit') limit = 25) {
    return await this.geService.getAllOffers(page, limit, 'BUY');
  }

  @Get('sell')
  async getAllSell(@Query('page') page = 1, @Query('limit') limit = 25) {
    return await this.geService.getAllOffers(page, limit, 'SELL');
  }
}
