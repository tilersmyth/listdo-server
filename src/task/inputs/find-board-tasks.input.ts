import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class BoardTasksInput {
  @Field(() => ID)
  readonly board: string;
  @Field()
  readonly status: string;
  @Field()
  readonly role: string;
}
