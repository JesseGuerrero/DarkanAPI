import { Inject, Injectable } from '@nestjs/common';
import { WORLD_MONGODB_PROVIDER } from 'src/constants';

@Injectable()
export class gim_highscoresService {
  constructor(@Inject(WORLD_MONGODB_PROVIDER) private readonly db: any) {}

  async getCount() {
    let count = await this.db.collection('GIMHighscores').count();
    return { count };
  }

  async get(page = 1, limit = 25) {
    page = Number(page);
    limit = Number(limit);
    const startIndex = (page - 1) * limit;
    let filter = {};
    let sort = {};
    return await this.db.collection('GIMHighscores').find(filter, { projection: { username: 0 } }).sort(sort).skip(startIndex).limit(limit).toArray();
  }
}
