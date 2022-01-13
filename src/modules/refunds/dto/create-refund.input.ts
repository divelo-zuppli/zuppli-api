import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateRefundInput {
  @Field(() => ID)
  order_id: number;
  title: string;
  description: string;
}
