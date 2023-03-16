import { Field, ObjectType } from '@nestjs/graphql';
import { Business as BusinessType } from '@prisma/client';

import { User } from '../../user/models/user.model';

@ObjectType()
export class Business implements Partial<BusinessType> {
  @Field()
  id: number;

  @Field()
  uid: string;

  @Field()
  name: string;

  @Field()
  phoneNumber: string;

  @Field()
  address: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // relations

  @Field(() => User)
  user: User;

  userId: number;
}
