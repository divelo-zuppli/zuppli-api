import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsOptional()
  @Length(5, 160)
  @IsString()
  @Field(() => String, { nullable: true })
  readonly fullName?: string;
}
