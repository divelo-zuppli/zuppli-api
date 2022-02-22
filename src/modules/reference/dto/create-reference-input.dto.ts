import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateReferenceInput {
  @IsString()
  @Field(() => String)
  readonly sku: string;

  @IsString()
  @Field(() => String)
  readonly name: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly description?: string;

  @IsString()
  @Field(() => String)
  readonly categoryUid: string;
}
