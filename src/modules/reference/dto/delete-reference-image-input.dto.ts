import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class DeleteReferenceImageInput {
  @IsString()
  @Field(() => String)
  readonly referenceUid: string;

  @IsString()
  @Field(() => String)
  readonly attachmentUid: string;
}
