import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { ReferenceAttachment } from './models/reference-attachment.model';
import { Attachment } from '../attachment/models/attachment.model';

import { ReferenceAttachmentLoaders } from './reference-attachment.loaders';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => ReferenceAttachment)
export class ReferenceAttachmentResolver {
  constructor(private readonly loaders: ReferenceAttachmentLoaders) {}

  /* RESOLVE FIELDS LOGIC */
  @ResolveField(() => Attachment, { name: 'attachment' })
  attachment(@Parent() parent: ReferenceAttachment): Promise<Attachment> {
    const value: any = parent.attachment;

    if (!value) return Promise.resolve(null);

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchAttachments.load(id);
  }
  /* RESOLVE FIELDS LOGIC */
}
