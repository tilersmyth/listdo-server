import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class CreateListInput {
  @Field(() => ID)
  readonly boardId: string;
  @Field()
  readonly name: string;
  @Field({ nullable: true })
  readonly slug?: string;
}
