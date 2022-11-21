import { Inject, Injectable } from '@nestjs/common';
import { WORLD_MONGODB_PROVIDER } from 'src/constants';

@Injectable()
export class GEService {
  constructor(@Inject(WORLD_MONGODB_PROVIDER) private readonly db: any) {}

  async getAllOffers(page = 1, limit = 25, offerType?: string) {
    page = Number(page);
    limit = Number(limit);
    const startIndex = (page - 1) * limit;
    let filter = offerType ? { offerType } : {};
    return await this.db.collection('grandexchange').find(filter, { projection: { _id: 0, box: 0, totalGold: 0, owner: 0, processedItems: 0 } }).skip(startIndex).limit(limit).toArray();
  }

  async getOffersByItem(page = 1, limit = 25, offerType?: string) {
    const startIndex = (page - 1) * limit;
    let filter = offerType ? { offerType } : {};
    return await this.db.collection('grandexchange').find(filter, { projection: { _id: 0, box: 0, totalGold: 0, owner: 0, processedItems: 0 } }).skip(startIndex).limit(limit).toArray();
  }
  
}
