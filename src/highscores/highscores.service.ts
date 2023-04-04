import { Inject, Injectable } from '@nestjs/common';
import { WORLD_MONGODB_PROVIDER } from 'src/constants';

@Injectable()
export class HighscoresService {
  constructor(@Inject(WORLD_MONGODB_PROVIDER) private readonly db: any) {}

  async getCount() {
    let count = await this.db.collection('highscores').count();
    return { count };
  }

  async get(page = 1, limit = 25, gamemode = 'all', skill = -1) {
    page = Number(page);
    limit = Number(limit);
    const startIndex = (page - 1) * limit;
    let filter = {};
    switch(gamemode) {
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
      sort = { levelDifference: -1, xpDifference: -1 };
    else {
      sort = { };
      sort['xp.'+skill] = -1;
    }
    return await this.db.collection('highscores').find(filter, { projection: { username: 0 } }).sort(sort).skip(startIndex).limit(limit).toArray();
  }
}
