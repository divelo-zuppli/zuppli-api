import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class ChangeUserPhoneNumberInput {
  @IsString()
  @Field(() => String)
  readonly authUid: string;

  @Length(10)
  @IsString()
  @Field(() => String)
  readonly phoneNumber: string;
}
