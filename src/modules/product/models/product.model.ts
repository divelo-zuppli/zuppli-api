import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Prisma, Product as ProductType } from '@prisma/client';

import { Reference } from '../../reference/models/reference.model';

@ObjectType()
export class Product implements Partial<ProductType> {
  @Field()
  id: number;

  @Field()
  uid: string;

  @Field(() => Float)
  sellPrice: Prisma.Decimal;

  @Field(() => Float)
  costPrice: Prisma.Decimal;

  @Field(() => Float, { nullable: true })
  salePrice: Prisma.Decimal;

  @Field()
  stock: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // relations

  @Field(() => Reference)
  reference: Reference;
}
