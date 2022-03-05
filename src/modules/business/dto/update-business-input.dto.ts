import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBusinessInput } from './create-business-input.dto';

@InputType()
export class UpdateBusinessInput extends PartialType(CreateBusinessInput) {}
