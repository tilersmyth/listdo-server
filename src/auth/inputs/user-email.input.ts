import { InputType, Field } from 'type-graphql';

@InputType()
export class UserEmailInput {
  @Field()
  readonly email: string;
}
