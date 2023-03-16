import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import { WebService } from './web.service';
import {CreateArticleDto} from "../web/dto/createArticleDto";
import {UpdateArticleDto} from "./dto/updateArticleDto";

@Controller('web')
export class WebController {
  constructor(private readonly webService: WebService) {}

  @Post('edit/:id')
  async edit(@Param('id') id : string, @Body() article : UpdateArticleDto) {
    return this.webService.edit(id, article)
  }

  @Post('delete/:id')
  async delete(@Param('id') id : string) {
    return this.webService.delete(id)
  }

  @Post('create-article')
  async create(@Body() article : CreateArticleDto) {
    return this.webService.create(article);
  }

  @Get()
  async getNews(@Query('page') page = 1, @Query('limit') limit = 6, @Query('type') type = 0) {
    return await this.webService.get(page, limit, type);
  }

  @Get('/count')
  async getCount() {
    return await this.webService.getCount();
  }
}
