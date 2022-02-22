import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @IsString()
  @Field(() => String)
  readonly name: string;

  @IsString()
  @Field(() => String, { nullable: true })
  readonly parentUid?: string;
}
