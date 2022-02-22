import * as DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { CategoryService } from '../category/category.service';

@Injectable({ scope: Scope.REQUEST })
export class ReferenceLoaders {
  constructor(private categoryService: CategoryService) {}

  public readonly batchCategories = new DataLoader(
    async (masterIds: number[]) => {
      const masters = await this.categoryService.getByIds(masterIds);
      const mastersMap = new Map(masters.map((item) => [item.id, item]));
      return masterIds.map((masterId) => mastersMap.get(masterId));
    },
  );
}
