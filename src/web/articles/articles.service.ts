import { HttpService } from '@nestjs/axios';
import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import { WORLD_MONGODB_PROVIDER } from 'src/constants';
import {CreateArticleDto} from "./dto/createArticleDto";
import slugify from 'slugify';
import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {UpdateArticleDto} from "./dto/updateArticleDto";
import {ObjectId} from "mongodb";

@Injectable()
export class ArticlesService {
  constructor(private readonly httpService: HttpService, @Inject(WORLD_MONGODB_PROVIDER) private readonly db: any) {}

  async create(article: CreateArticleDto) {
    try {
      let articleCopy = article
      articleCopy["slug"] = slugify(articleCopy.title, { lower: true, strict: true })
      articleCopy["createdAt"] = new Date(Date.now())
      articleCopy["sanitizedHtml"] = articleCopy.markdown
      articleCopy["type"] = Number(articleCopy.type)
      this.db.collection('articles').insertOne(articleCopy)
    } catch(e) {
      console.log(e)
      throw new BadRequestException(e.response.data.error);
    }
  }

  async edit(id : string, article: UpdateArticleDto) {
    try {
      let articleCopy = article
      articleCopy["sanitizedHtml"] = articleCopy.markdown
      this.db.collection('articles').updateOne({_id: new ObjectId(id)}, { $set: articleCopy})
    } catch(e) {
      console.log(e)
      throw new BadRequestException(e.response.data.error);
    }
  }

  async delete(id : string) {
    try {
      this.db.collection('articles').deleteOne({_id: new ObjectId(id)})
    } catch(e) {
      console.log(e)
      throw new BadRequestException(e.response.data.error);
    }
  }

  async getCount() {
    let count = await this.db.collection('articles').count();
    return { count };
  }

  async get(page = 1, limit = 6, type = 0) {
    page = Number(page);
    limit = Number(limit);
    type = Number(type)
    const startIndex = (page - 1) * limit;
    let filter = {};

    if(type >= 1 && type <= 4)
      filter = { type : type };

    let sort = { createdAt: 'desc' };
    return await this.db.collection('articles').find(filter).sort(sort).skip(startIndex).limit(limit).toArray();
  }

  async getById(id: string) {
    return await this.db.collection('articles').findOne({ "_id": new ObjectId(id) })
  }

  async getBySlug(slug: string) {
    return await this.db.collection('articles').findOne({ "slug": slug })
  }

  async getOneOrFail(title: string) {
    return await this.db.collection('articles').find({slug: slugify(title, { lower: true, strict: true })}).toArray()
  }
}

@ValidatorConstraint({ name: 'TitleExists', async: true })
@Injectable()
export class TitleExistsRule implements ValidatorConstraintInterface {
  constructor(private webService: ArticlesService) {}

  // @ts-ignore
  async validate(title: string) {
    let article = await this.webService.getOneOrFail(title)
    return article.length == 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `Title/slug already exists, use a different title!`;
  }
}
