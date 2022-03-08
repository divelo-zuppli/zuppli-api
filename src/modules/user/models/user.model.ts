import { Field, ObjectType } from '@nestjs/graphql';
import { User as UserType } from '@prisma/client';

import { Business } from '../../business/models/business.model';

@ObjectType()
export class User implements Partial<UserType> {
  @Field()
  id: number;

  @Field()
  uid: string;

  @Field()
  authUid: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  fullName: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // relations
  @Field(() => [Business], { nullable: true })
  businesses: Business[];
}
