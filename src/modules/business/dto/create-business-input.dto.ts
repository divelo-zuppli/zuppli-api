import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateBusinessInput {
  @IsString()
  @Field(() => String)
  readonly name: string;

  @IsString()
  @Field(() => String)
  readonly phoneNumber: string;

  @IsString()
  @Field(() => String)
  readonly address: string;

  @IsString()
  @Field(() => String)
  readonly authUid: string;
}
