import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryAttachment as CategoryAttachmentType } from '@prisma/client';

import { Category } from '../../category/models/category.model';
import { Attachment } from '../../attachment/models/attachment.model';

@ObjectType()
export class CategoryAttachment implements Partial<CategoryAttachmentType> {
  @Field()
  main: boolean;

  @Field({ nullable: true })
  version?: string;

  @Field()
  createdAt: Date;

  // relations

  @Field(() => Category)
  category: Category;

  @Field(() => Attachment)
  attachment: Attachment;
}
