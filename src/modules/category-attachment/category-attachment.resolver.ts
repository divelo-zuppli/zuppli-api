import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { CategoryAttachment } from './models/category-attachment.model';
import { Attachment } from '../attachment/models/attachment.model';

import { CategoryAttachmentLoaders } from './category-attachment.loaders';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => CategoryAttachment)
export class CategoryAttachmentResolver {
  constructor(private readonly loaders: CategoryAttachmentLoaders) {}

  /* RESOLVE FIELDS LOGIC */
  @ResolveField(() => Attachment, { name: 'attachment' })
  attachment(@Parent() parent: CategoryAttachment): Promise<Attachment> {
    const value: any = parent.attachment;

    if (!value) return Promise.resolve(null);

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchAttachments.load(id);
  }
  /* RESOLVE FIELDS LOGIC */
}
