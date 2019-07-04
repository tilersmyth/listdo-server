import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class UserInput {
  @Field(() => ID)
  readonly id: string;
  @Field()
  readonly email: string;
  @Field(() => [String])
  readonly boards: string[];
}
