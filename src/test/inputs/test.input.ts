import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class TestInput {
  @Field()
  readonly name: string;
  @Field(() => Int)
  readonly count: number;
}
