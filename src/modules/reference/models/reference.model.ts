import { Field, ObjectType } from '@nestjs/graphql';
import { Reference as ReferenceType } from '@prisma/client';

import { Category } from '../../category/models/category.model';

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // relations
  @Field(() => Category)
  category: Category[];
}
