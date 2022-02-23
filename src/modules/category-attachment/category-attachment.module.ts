import { Module } from '@nestjs/common';

import { CategoryAttachmentLoaders } from './category-attachment.loaders';
import { CategoryAttachmentResolver } from './category-attachment.resolver';

import { AttachmentModule } from '../attachment/attachment.module';

@Module({
  imports: [AttachmentModule],
  providers: [CategoryAttachmentLoaders, CategoryAttachmentResolver],
})
export class CategoryAttachmentModule {}
