import { HttpService } from '@nestjs/axios';
import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import { WORLD_MONGODB_PROVIDER } from 'src/constants';

import slugify from 'slugify';
import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {CreatePlayerTemporalHiscoreDto} from "./dto/createPlayerTemporalHiscoreDto";
import {ObjectId} from "mongodb";
import {CreateTemporalHiscoreDto} from "./dto/createTemporalHiscoreDto";

@Injectable()
export class TemporalHiscoreService {
  constructor(private readonly httpService: HttpService, @Inject(WORLD_MONGODB_PROVIDER) private readonly db: any) {}

  async create(hiscore: CreateTemporalHiscoreDto) {
    try {
      this.db.collection('temporal').insertOne(hiscore)
    } catch(e) {
      console.log(e)
      throw new BadRequestException(e.response.data.error);
    }
  }

  async createPlayer(playerHiscore: CreatePlayerTemporalHiscoreDto) {
    try {
      this.db.collection('temporalPlayers').insertOne(playerHiscore)
    } catch(e) {
      console.log(e)
      throw new BadRequestException(e.response.data.error);
    }
  }

  async delete(days : Number) {
    days = Number(days)
    try {
      this.db.collection('temporal').deleteOne({days: days})
    } catch(e) {
      console.log(e)
      throw new BadRequestException(e.response.data.error);
    }
  }

  async deletePlayers(days : Number) {
    days = Number(days)
    try {
      this.db.collection('temporalPlayers').deleteMany({days: days})
    } catch(e) {
      console.log(e)
      throw new BadRequestException(e.response.data.error);
    }
  }


  async getCount() {
    let count = await this.db.collection('temporal').count();
    return { count };
  }

  async get(days = 1, page = 1, limit = 6, type = 0) {
    days = Number(days)
    page = Number(page);
    limit = Number(limit);
    type = Number(type)
    const startIndex = (page - 1) * limit;
    let filter = {};

    if(type >= 1 && type <= 4)
      filter = { type : type };

    let sort = { createdAt: 'desc' };
    return await this.db.collection('temporal').find(filter).sort(sort).skip(startIndex).limit(limit).toArray();
  }

  async getPlayer(username: string, days = 1, page = 1, limit = 6) {
    days = Number(days)
    page = Number(page);
    limit = Number(limit);
    const startIndex = (page - 1) * limit;
    let filter = {};

    filter = {
      username : username,
      days: days
    };
    return await this.db.collection('temporal').find(filter).skip(startIndex).limit(limit).toArray();
  }

  async getById(id: string) {
    return await this.db.collection('temporal').findOne({ "_id": new ObjectId(id) })
  }

  async getByUsername(slug: string) {
    return await this.db.collection('temporal').findOne({ "slug": slug })
  }

  async getOneOrFail(title: string) {
    return await this.db.collection('temporal').find({slug: slugify(title, { lower: true, strict: true })}).toArray()
  }
}

@ValidatorConstraint({ name: 'TitleExists', async: true })
@Injectable()
export class TitleExistsRule implements ValidatorConstraintInterface {
  constructor(private webService: TemporalHiscoreService) {}

  // @ts-ignore
  async validate(title: string) {
    let article = await this.webService.getOneOrFail(title)
    return article.length == 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `Title/slug already exists, use a different title!`;
  }
}
