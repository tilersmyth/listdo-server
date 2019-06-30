import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class CreateListInput {
  @Field(() => ID)
  readonly boardId: string;
  @Field()
  readonly user: string;
  @Field()
  readonly name: string;
}
