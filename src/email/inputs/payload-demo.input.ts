import { InputType, Field } from 'type-graphql';

@InputType()
export class PayloadDemoInput {
  @Field()
  readonly messageId: string;
  @Field()
  readonly inReplyTo: string;
  @Field()
  readonly subject: string;
  @Field({ nullable: true })
  readonly text: string | null;
  @Field({ nullable: true })
  readonly textAsHtml: string | null;
  @Field({ nullable: true })
  readonly textPreview: string | null;
  @Field()
  readonly date: Date;
}
