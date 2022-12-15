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

  checkday(date, daysBack) {
    let docDate = new Date(date)
    let pastDoc = new Date(new Date().setDate(new Date().getDate() - daysBack));
    if (docDate.getDate() == pastDoc.getDate() && docDate.getMonth() == pastDoc.getMonth() && docDate.getFullYear() == pastDoc.getFullYear())
      return true
  }

  async get(daysBackward = 0, page = 1, limit = 25, gamemode = 'all', skill = -1) {
    page = Number(page);
    limit = Number(limit);
    let iron = false
    const startIndex = (page - 1) * limit;
    switch (gamemode) {
      case 'ironman':
        iron = true
        break;
    }
    let temporalHS = await this.db.collection('temporalHS').find().toArray();
    for(let i = 0; i < temporalHS.length; i++) {
      if (this.checkday(temporalHS[i].date, daysBackward)) {
        let hs = temporalHS[i].highscore
        if(iron) {
          let ironHS = []
          for (let j = 0; j < hs.length; j++) {
            let player = hs[j]
            if(player.ironman == true)
              ironHS.push(player)
          }
          hs = ironHS
        }
        let pagedHS = []
        for(let j = startIndex; j < startIndex + limit; j++) {
          if(hs[j] != null)
            pagedHS.push(hs[j])
        }
        hs = pagedHS
        return hs;
      }
    }
    return {};
  }

  async collectionExists(name) {
    return await this.db.listCollections({name: name}).hasNext();
  }

  async save() {//https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
    const database = this.db;
      if(!this.collectionExists("temporalHS")) {
        database.createCollection("temporalHS", {strict:true})
      }
      let todayHS = {"date": new Date(), "highscore": await this.highscoresService.get(1, 9999999)}

      // console.log(todayHS)
      database.collection("temporalHS").insertOne(todayHS)
      database.collection("temporalHS").find().forEach(function(doc) {
        if(doc) {
          let docDate = new Date(doc.date)
          let deleteDate = new Date(new Date().setDate(new Date().getDate() - 90));
          if(docDate < deleteDate) {
            database.collection("temporalHS").deleteOne(doc)
          }
        }
      })
      return {};
  }
}
