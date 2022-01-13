import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryAttachment as CategoryAttachmentType } from '@prisma/client';

import { Category } from '../../categories/models/category.model';
import { Attachment } from '../../attachment/models/attachment.model';

@ObjectType()
export class CategoryAttachment implements Partial<CategoryAttachmentType> {
  @Field()
  createdAt: Date;

  // relations

  @Field(() => Category)
  category: Category;

  @Field(() => Attachment)
  attachment: Attachment;
}
