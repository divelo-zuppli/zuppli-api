import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class GetOneCategoryInput {
  @IsString()
  @Field(() => String)
  readonly uid: string;
}
