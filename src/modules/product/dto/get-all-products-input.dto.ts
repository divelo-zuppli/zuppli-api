import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class GetAllProductsInput {
  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  readonly skip?: number;
}
