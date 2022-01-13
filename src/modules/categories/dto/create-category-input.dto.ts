import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  readonly name: string;

  @Field(() => String, { nullable: true })
  readonly parentUid?: string;
}
