import { Field, ObjectType } from '@nestjs/graphql';
import { Category as CategoryType } from '@prisma/client';
import { Attachment } from 'src/modules/attachment/models/attachment.model';

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

  @Field(() => [Attachment], { nullable: true })
  attatchments: Attachment[];
}
