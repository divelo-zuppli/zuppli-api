import { Module } from '@nestjs/common';

import { ReferenceAttachmentResolver } from './reference-attachment.resolver';
import { ReferenceAttachmentLoaders } from './reference-attachment.loaders';

import { AttachmentModule } from '../attachment/attachment.module';

@Module({
  imports: [AttachmentModule],
  providers: [ReferenceAttachmentLoaders, ReferenceAttachmentResolver],
})
export class ReferenceAttachmentModule {}
