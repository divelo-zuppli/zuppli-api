import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class DeleteCategoryImageInput {
  @IsString()
  @Field(() => String)
  readonly categoryUid: string;

  @IsString()
  @Field(() => String)
  readonly attachmentUid: string;
}
