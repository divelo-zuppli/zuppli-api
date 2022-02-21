import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class UploadCategoryImageInput {
  @IsUUID()
  @Field(() => String)
  readonly uid: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  readonly main?: boolean;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly version?: string;
}
