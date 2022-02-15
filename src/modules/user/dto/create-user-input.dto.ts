import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsOptional()
  @Length(5, 160)
  @IsString()
  @Field(() => String, { nullable: true })
  readonly fullName?: string;

  @IsEmail()
  @Field(() => String)
  readonly email: string;

  @Length(10, 10)
  @IsString()
  @Field(() => String)
  readonly phoneNumber: string;

  @Length(6, 16)
  @IsString()
  @Field(() => String)
  readonly password: string;
}
