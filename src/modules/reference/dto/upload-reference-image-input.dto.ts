import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

enum VersionEnum {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

@InputType()
export class UploadReferenceImageInput {
  @IsString()
  @Field(() => String)
  readonly uid: string;

  @IsEnum(VersionEnum, {
    message: 'version must be one of ' + Object.keys(VersionEnum).join(', '),
  })
  @Field(() => String)
  readonly version: VersionEnum;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  readonly main?: boolean;
}
