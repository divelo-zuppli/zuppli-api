import { Field, ObjectType } from '@nestjs/graphql';
import { Attachment as AttachmentType } from '@prisma/client';

@ObjectType()
export class Attachment implements Partial<AttachmentType> {
  @Field()
  id: number;

  @Field()
  uid: string;

  @Field()
  cloudId: string;

  @Field()
  type: string;

  @Field()
  url: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // relations
}
