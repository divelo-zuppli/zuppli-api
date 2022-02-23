import * as DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { AttachmentService } from '../attachment/attachment.service';

@Injectable({ scope: Scope.REQUEST })
export class ReferenceAttachmentLoaders {
  constructor(private attachmentService: AttachmentService) {}

  public readonly batchAttatchments = new DataLoader(
    async (masterIds: number[]) => {
      const masters = await this.attachmentService.getByIds(masterIds);
      const mastersMap = new Map(masters.map((item) => [item.id, item]));
      return masterIds.map((masterId) => mastersMap.get(masterId));
    },
  );
}
