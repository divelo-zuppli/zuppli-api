import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

enum RoleCode {
  Customer = '01C',
}

@InputType()
export class CreateUserFromAdminInput {
  @IsOptional()
  @Length(5, 160)
  @IsString()
  @Field(() => String, { nullable: true })
  readonly fullName: string;

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

  @IsEnum(RoleCode, {
    message: () => {
      const keys = Object.keys(RoleCode).filter((x) => !(parseInt(x) >= 0));

      return `roleCode must be one value for one of ${keys.join(', ')} keys`;
    },
  })
  @Field(() => String)
  readonly roleCode: string;
}
