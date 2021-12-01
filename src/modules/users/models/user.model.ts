import { Field, ObjectType } from '@nestjs/graphql';
import { User as UserType } from '@prisma/client';

@ObjectType()
export class User implements UserType {
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
}
