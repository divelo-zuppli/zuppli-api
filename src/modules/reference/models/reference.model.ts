import { Field, ObjectType } from '@nestjs/graphql';
import { Reference as ReferenceType } from '@prisma/client';

import { Category } from '../../category/models/category.model';
import { ReferenceAttachment } from '../../reference-attachment/models/reference-attachment.model';

@ObjectType()
export class Reference implements Partial<ReferenceType> {
  @Field()
  id: number;

  @Field()
  uid: string;

  @Field()
  sku: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  packaging?: string;

  @Field({ nullable: true })
  measurementUnit?: string;

  @Field({ nullable: true })
  measurementValue?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // relations

  @Field(() => Category)
  category: Category;

  @Field(() => [ReferenceAttachment], { nullable: true })
  referenceAttachments: ReferenceAttachment[];
}
