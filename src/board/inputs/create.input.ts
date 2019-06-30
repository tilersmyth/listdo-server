import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateInput {
  @Field()
  readonly name: string;
}
