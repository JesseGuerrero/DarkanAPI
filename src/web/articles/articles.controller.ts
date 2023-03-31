import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import {CreateArticleDto} from "./dto/createArticleDto";
import {UpdateArticleDto} from "./dto/updateArticleDto";

@Controller('web')
export class ArticlesController {
  constructor(private readonly webService: ArticlesService) {}

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

  @Get("get-article/:id")
  async getArticle(@Param('id') id : string) {
    return await this.webService.getById(id);
  }

  @Get("get-article-slug/:slug")
  async getArticleSlug(@Param('slug') slug : string) {
    return await this.webService.getBySlug(slug);
  }

  @Get('/count')
  async getCount() {
    return await this.webService.getCount();
  }
}
