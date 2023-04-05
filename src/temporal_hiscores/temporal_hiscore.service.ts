import { HttpService } from '@nestjs/axios';
import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import { WORLD_MONGODB_PROVIDER } from 'src/constants';

import slugify from 'slugify';
import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {Utils} from "../util";

@Injectable()
export class TemporalHiscoreService {
  constructor(private readonly httpService: HttpService, @Inject(WORLD_MONGODB_PROVIDER) private readonly db: any) {}

  async get(daysBack = 1, page = 1, limit = 6, skill = -1) {
    daysBack = Number(daysBack)
    page = Number(page);
    limit = Number(limit);
    skill = Number(skill)
    let response = {
      daysBack: daysBack,
      snapshot: []
    }

    let queryDate = new Date()
    let filter = {date: queryDate.toDateString()};
    let todayHiscore = await this.db.collection('temporal').find(filter).toArray();
    let todaySnapshot = todayHiscore[0]["snapshot"]

    queryDate.setDate(queryDate.getDate() - daysBack)
    filter = {date: queryDate.toDateString()};
    let daysBackHiscore = await this.db.collection('temporal').find(filter).toArray();
    let daysBackSnapshot = daysBackHiscore[0]["snapshot"]
    Object.keys(daysBackSnapshot)

    let snapshot = []
    Object.keys(todaySnapshot).forEach(function (key) {
      let playerObject = {}
      playerObject[key] = {
        xpDifference: -1,
        levelDifference: 0
      }
      if (daysBackSnapshot[key] == undefined) {
        snapshot.push(playerObject)
        return;
      }
      if(skill == -1)
        playerObject[key] = {
          xpDifference: (todaySnapshot[key].totalXp - daysBackSnapshot[key].totalXp),
          levelDifference: (todaySnapshot[key].totalLevel - daysBackSnapshot[key].totalLevel)
        }
      else
        playerObject[key] = {
          xpDifference: (todaySnapshot[key].xp[skill] - daysBackSnapshot[key].xp[skill]),
          levelDifference: (Utils.getSkillLevelByXP(todaySnapshot[key].xp[skill], skill) - Utils.getSkillLevelByXP(daysBackSnapshot[key].xp[skill], skill))
        }
      snapshot.push(playerObject)
    });

    snapshot.sort((a, b) => {
      if (a[Object.keys(a)[0]].xpDifference == b[Object.keys(b)[0]].xpDifference)
        return 0
      if (a[Object.keys(a)[0]].xpDifference > b[Object.keys(b)[0]].xpDifference)
        return -1
      else
        return 1
    })

    const startIndex = (page - 1) * limit;
    snapshot = snapshot.slice(startIndex, startIndex+limit)
    response["snapshot"] = snapshot
    return response
  }


  async getPlayer(username = "", daysBack = 1) {
    daysBack = Number(daysBack)
    username = Utils.formatNameForDisplay(username)
    const todaysDate = new Date().toDateString()
    let date = (new Date())
    date.setDate(date.getDate() - daysBack)
    const pastDate = date.toDateString()

    let filter = {username: username};
    let playerData = await this.db.collection('temporalPlayer').find(filter).toArray();
    if (playerData.length == 0)
      return {}
    playerData = playerData[0]
    const todaysData = playerData[todaysDate]
    const pastData = playerData[pastDate]

    if (todaysData == undefined || pastData == undefined)
      return {}

    let xpDifferential = []
    for (let i = 0; i < todaysData.xp.length; i++)
      xpDifferential[i] = todaysData.xp[i] - pastData.xp[i]
    let differentialData = {
      daysBack: daysBack,
      totalXp: todaysData.totalXP - pastData.totalXP,
      totalLevel: todaysData.totalLevel - pastData.totalLevel,
      xpDifferential: xpDifferential
    }
    return differentialData
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
