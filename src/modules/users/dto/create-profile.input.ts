import { Field, ID, InputType, PickType } from '@nestjs/graphql';
import { Profile } from '../entities/profile.entity';

@InputType()
export class ProfileInput extends PickType(Profile, [
  'bio',
  'socials',
  'contact',
]) {
  customer: ConnectBelongsTo;
}
@InputType()
export class ConnectBelongsTo {
  @Field(() => ID)
  connect: number;
}
