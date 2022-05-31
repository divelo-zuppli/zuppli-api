import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @IsNumber()
  @Field(() => Float)
  readonly costPrice: number;

  @IsNumber()
  @Field(() => Float)
  readonly sellPrice: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  readonly salePrice: number;

  @IsNumber()
  @Field(() => Int)
  readonly stock: number;

  @IsString()
  @Field(() => String)
  readonly referenceUid: string;
}
