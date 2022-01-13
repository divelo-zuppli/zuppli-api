import { Module } from '@nestjs/common';

import { CategoryAttachmentService } from './category-attachment.service';

@Module({
  providers: [CategoryAttachmentService],
  exports: [CategoryAttachmentService],
})
export class CategoryAttachmentModule {}
