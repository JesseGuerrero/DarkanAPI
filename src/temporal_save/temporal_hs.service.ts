import { PORT, WORLD_MONGODB_PROVIDER } from "../constants";
import { HttpModule, HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
import { Inject, Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import * as config from '../../config';

@Injectable()
export class Temporal_HSService {
  constructor(private readonly httpService: HttpService, @Inject(WORLD_MONGODB_PROVIDER) private readonly db: any) {}


  async get(daysBackward = 1, page = 1, limit = 25, gamemode = 'all', skill = -1) {
    page = Number(page);
    limit = Number(limit);
    const startIndex = (page - 1) * limit;
    let filter = {};
    switch (gamemode) {
      case 'ironman':
        filter = { ironman: true };
        break;
      case 'regular':
        filter = { ironman: false };
        break;
      default:
        filter = {};
        break;
    }
    let sort = {};
    if (!skill || skill < 0)
      sort = { totalLevel: -1, totalXp: -1 };
    else {
      sort = {};
      sort['xp.' + skill] = -1;
    }
    return await this.db.collection('temporalHS').find(filter, { projection: { username: 0 } }).sort(sort).skip(startIndex).limit(limit).toArray();
  }

  async save(highscore) {
      let response = await this.db.listCollections({name: "temporalHS"})
      return response.data;
  }
}
