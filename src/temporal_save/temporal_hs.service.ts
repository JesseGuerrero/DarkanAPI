import { PORT, WORLD_MONGODB_PROVIDER } from "../constants";
import { HttpModule, HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
import { Inject, Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import * as config from '../../config';
import { HighscoresService } from "../highscores/highscores.service";

@Injectable()
export class Temporal_HSService {
  constructor(private readonly httpService: HttpService, private readonly highscoresService: HighscoresService, @Inject(WORLD_MONGODB_PROVIDER) private readonly db: any) {}


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

  async collectionExists(name) {
    return await this.db.listCollections({name: name}).hasNext();
  }

  async save() {//https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
      if(!this.collectionExists("temporalHS")) {
        this.db.createCollection("temporalHS", {strict:true})
      }
      let todayHS = {"date": new Date(), "highscore": await this.highscoresService.get(1, 9999999)}

      // console.log(todayHS)
      this.db.collection("temporalHS").insertOne(todayHS)
      this.db.collection("temporalHS").find().forEach(function(doc) {
        if(doc) {
          let docDate = new Date(doc.date)
          // let deleteDate = new Date(new Date().setDate(new Date().getDate() - 90));
          let deleteDate = new Date();
          deleteDate.setSeconds(deleteDate.getSeconds() - 30)
          if(docDate < deleteDate) {
            this.db.collection("temporalHS").deleteOne(doc)
          }
        }
      })
      return {};
  }
}
