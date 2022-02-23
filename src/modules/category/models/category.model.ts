import { Field, ObjectType } from '@nestjs/graphql';
import { Category as CategoryType } from '@prisma/client';

import { CategoryAttachment } from '../../category-attachment/models/category-attachment.model';
import { Reference } from '../../reference/models/reference.model';

@ObjectType()
export class Category implements Partial<CategoryType> {
  @Field()
  id: number;

  @Field()
  uid: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // relations

  @Field(() => Category, { nullable: true })
  parent: Category;

  @Field(() => [Category], { nullable: true })
  children: Category[];

  @Field(() => [CategoryAttachment], { nullable: true })
  categoryAttachments: CategoryAttachment[];

  @Field(() => [Reference], { nullable: true })
  references: Reference[];
}
