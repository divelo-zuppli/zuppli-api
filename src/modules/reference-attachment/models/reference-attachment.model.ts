import { Field, ObjectType } from '@nestjs/graphql';
import { ReferenceAttachment as ReferenceAttachmentType } from '@prisma/client';

import { Reference } from '../../reference/models/reference.model';
import { Attachment } from '../../attachment/models/attachment.model';

@ObjectType()
export class ReferenceAttachment implements Partial<ReferenceAttachmentType> {
  @Field()
  main: boolean;

  @Field({ nullable: true })
  version?: string;

  @Field()
  createdAt: Date;

  // relations

  @Field(() => Reference)
  reference: Reference;

  @Field(() => Attachment)
  attachment: Attachment;
}
