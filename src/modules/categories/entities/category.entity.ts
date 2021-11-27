import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Type } from 'src/modules/types/entities/type.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
export class Category extends CoreEntity {
  name: string;
  slug: string;
  parent?: Category;
  @Field(() => ID, { nullable: true })
  parent_id?: number;
  @Field(() => Int, { nullable: true })
  products_count?: number;
  children?: Category[];
  details?: string;
  image?: Attachment;
  icon?: string;
  type?: Type;
  products?: Product[];
}
