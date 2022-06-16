import * as DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { ReferenceService } from '../reference/reference.service';

@Injectable({ scope: Scope.REQUEST })
export class ProductLoaders {
  constructor(private referenceService: ReferenceService) {}

  public readonly batchReferences = new DataLoader(
    async (masterIds: number[]) => {
      const masters = await this.referenceService.getByIds(masterIds);
      const mastersMap = new Map(masters.map((item) => [item.id, item]));
      return masterIds.map((masterId) => mastersMap.get(masterId));
    },
  );
}
