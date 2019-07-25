import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class AddMemberInput {
  @Field(() => ID)
  readonly boardId: string;
  @Field()
  readonly email: string;
}
