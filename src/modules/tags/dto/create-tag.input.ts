import { InputType, PickType } from '@nestjs/graphql';
import { Tag } from '../entities/tag.entity';

@InputType()
export class CreateTagInput extends PickType(Tag, [
  'name',
  'details',
  'icon',
]) {}
