import { InputType, PartialType } from '@nestjs/graphql';
import { CreateReferenceInput } from './create-reference-input.dto';

@InputType()
export class UpdateReferenceInput extends PartialType(CreateReferenceInput) {}
