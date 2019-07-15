import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class MemberDemoInput {
  @Field(() => ID)
  readonly user: string;
  @Field()
  readonly role: string;
}
