import { HttpService } from '@nestjs/axios';
import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import { WORLD_MONGODB_PROVIDER } from 'src/constants';
import fetch from 'node-fetch';
import slugify from 'slugify';
import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {Utils} from "../util";
import {first} from "rxjs";

//Make a day range
//Use ChartJS to make charts like Rune Metrics

@Injectable()
export class TemporalHiscoreService {
  constructor(private readonly httpService: HttpService, @Inject(WORLD_MONGODB_PROVIDER) private readonly db: any) {}

  async get(firstDayPast = 0, secondDayPast = 1, page = 1, limit = 6, skill = -1) {
    firstDayPast = Number(firstDayPast)
    secondDayPast = Number(secondDayPast)
    if(firstDayPast >= secondDayPast)
      return {error: "firstDayPast must be less than second day"}
    page = Number(page);
    limit = Number(limit);
    skill = Number(skill)

    let firstDate = new Date()
    firstDate.setDate(firstDate.getDate() - firstDayPast)
    let filter = {date: firstDate.toDateString()};
    let firstHighscore = await this.db.collection('temporal').find(filter).toArray();
    let firstSnapshot = firstHighscore[0]["snapshot"]

    let secondDate = new Date()
    secondDate.setDate(secondDate.getDate() - secondDayPast)
    filter = {date: secondDate.toDateString()};
    let daysBackHiscore = await this.db.collection('temporal').find(filter).toArray();
    let daysBackSnapshot = daysBackHiscore[0]["snapshot"]
    Object.keys(daysBackSnapshot)
    let response = {
      firstDayPast: firstDate.toDateString(),
      secondDayPast: secondDate.toDateString(),
      snapshot: []
    }


    let snapshot = []
    Object.keys(firstSnapshot).forEach(function (key) {
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
          xpDifference: (firstSnapshot[key].totalXp - daysBackSnapshot[key].totalXp),
          levelDifference: (firstSnapshot[key].totalLevel - daysBackSnapshot[key].totalLevel)
        }
      else
        playerObject[key] = {
          xpDifference: (firstSnapshot[key].xp[skill] - daysBackSnapshot[key].xp[skill]),
          levelDifference: (Utils.getSkillLevelByXP(firstSnapshot[key].xp[skill], skill) - Utils.getSkillLevelByXP(daysBackSnapshot[key].xp[skill], skill))
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


  async getPlayer(firstDayPast = 0, secondDayPast = 1, username = "") {
    if(firstDayPast >= secondDayPast)
      return {error: "first day must be less than second day"}
    firstDayPast = Number(firstDayPast)
    secondDayPast = Number(secondDayPast)
    username = Utils.formatNameForDisplay(username)
    let firstDayPastDate = new Date()
    firstDayPastDate.setDate(firstDayPastDate.getDate() - firstDayPast)
    const firstDay = firstDayPastDate.toDateString()
    let date = (new Date())
    date.setDate(date.getDate() - secondDayPast)
    const pastDate = date.toDateString()

    let filter = {username: username};
    let playerData = await this.db.collection('temporalPlayer').find(filter).toArray();
    if (playerData.length == 0)
      return {}
    playerData = playerData[0]
    const todaysData = playerData[firstDay]
    const pastData = playerData[pastDate]

    if (todaysData == undefined || pastData == undefined)
      return {}

    let xpRanks = []
    let levelsUp = []
    let overallRank = -1
    let overallLevelsUp = -1
    for(let skill = -1; skill < 25; skill++) {
      let response = await fetch(`http://localhost:8443/v1/temporal?daysBack=${secondDayPast}&limit=99999&skill=${skill}`);
      let temporal = await response.json();
      let snapshot = temporal["snapshot"]
      for(let i = 0; i < snapshot.length; i++) {
        let snapshotUser = Object.keys(snapshot[i])[0]
        if(snapshotUser == username) {
          if(skill == -1) {
            overallRank = i+1
            overallLevelsUp = snapshot[i][snapshotUser].levelDifference
            break
          }
          xpRanks.push(i+1)
          levelsUp.push(snapshot[i][snapshotUser].levelDifference)
          break
        }
      }
    }

    let xpDifferential = []
    for (let i = 0; i < todaysData.xp.length; i++)
      xpDifferential[i] = todaysData.xp[i] - pastData.xp[i]
    let differentialData = {
      firstDayPast: firstDay,
      secondDayPast: pastDate,
      totalXp: todaysData.totalXP - pastData.totalXP,
      totalLevel: todaysData.totalLevel - pastData.totalLevel,
      xpDifferential: xpDifferential,
      xpRanks: xpRanks,
      levelsUp: levelsUp,
      overallRank: overallRank,
      overallLevelsUp: overallLevelsUp
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
