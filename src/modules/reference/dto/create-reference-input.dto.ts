import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

enum Packaging {
  Unidad = 'Unidad',
  Display = 'Display',
  Caja = 'Caja',
}

enum MeasurementUnit {
  kg = 'kg',
  gr = 'gr',
  ml = 'ml',
  lt = 'lt',
}
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

  @IsOptional()
  @IsEnum(Packaging, {
    message: () => {
      const keys = Object.keys(Packaging).filter((x) => !(parseInt(x) >= 0));
      return `packaging must be one of ${keys.join(', ')}`;
    },
  })
  @Field(() => String, { nullable: true })
  readonly packaging?: string;

  @IsOptional()
  @IsString()
  @IsEnum(MeasurementUnit, {
    message: () => {
      const keys = Object.keys(MeasurementUnit).filter(
        (x) => !(parseInt(x) >= 0),
      );
      return `measurementUnit must be one of ${keys.join(', ')}`;
    },
  })
  @Field(() => String, { nullable: true })
  readonly measurementUnit?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  readonly measurementValue?: number;

  @IsString()
  @Field(() => String)
  readonly categoryUid: string;
}
