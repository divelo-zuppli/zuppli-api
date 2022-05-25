import * as DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { UserService } from '../user/user.service';

@Injectable({ scope: Scope.REQUEST })
export class BusinessLoaders {
  constructor(private userService: UserService) {}

  public readonly batchUsers = new DataLoader(async (masterIds: number[]) => {
    const masters = await this.userService.getByIds(masterIds);
    const mastersMap = new Map(masters.map((item) => [item.id, item]));
    return masterIds.map((masterId) => mastersMap.get(masterId));
  });
}
