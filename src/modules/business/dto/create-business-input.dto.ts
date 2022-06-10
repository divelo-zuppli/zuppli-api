import { Field, InputType } from '@nestjs/graphql';
import { IsNumberString, IsString, Length } from 'class-validator';

@InputType()
export class CreateBusinessInput {
  @IsString()
  @Field(() => String)
  readonly name: string;

  @Length(10)
  @IsNumberString()
  @Field(() => String)
  readonly phoneNumber: string;

  @IsString()
  @Field(() => String)
  readonly address: string;

  @IsString()
  @Field(() => String)
  readonly authUid: string;
}
