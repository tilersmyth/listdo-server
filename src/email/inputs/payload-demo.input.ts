import { InputType, Field } from 'type-graphql';

@InputType()
export class PayloadDemoInput {
  @Field()
  readonly messageId: string;
  @Field()
  readonly from: string;
  @Field(() => [String])
  readonly to: string[];
  @Field(() => [String])
  readonly cc: string[];
  @Field()
  readonly subject: string;
  @Field({ nullable: true })
  readonly bodyText: string | null;
  @Field({ nullable: true })
  readonly bodyHtml: string | null;
}
