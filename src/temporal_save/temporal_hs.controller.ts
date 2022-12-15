import { Body, Controller, Get, NotFoundException, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { Temporal_HSService } from "./temporal_hs.service";
import { HighscoresService } from "../highscores/highscores.service";

@Controller('temporal-hs')
export class TemporalHSController {
  constructor(private readonly TemporalHSService: Temporal_HSService) {}

  @Post('save')//TODO:LOOK at this service and copy it. Run the looping script from the website...
  async save() {
    console.log("save")
    console.log(await this.TemporalHSService.save())
    return {"hi":"bye"}
  }

  @Get()
  async getOverall(@Query('days-backward') daysBackward = 0, @Query('page') page = 1, @Query('limit') limit = 25, @Query('gamemode') gamemode = 'all', @Query('skill') skill = -1) {
    return await this.TemporalHSService.get(daysBackward, page, limit, gamemode, skill);
  }

}
