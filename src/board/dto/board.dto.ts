import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class BoardDto {
  @Field(() => ID)
  readonly id: string;
  @Field()
  readonly name: string;
  @Field()
  readonly owner: string;
  @Field()
  readonly slug: string;
}
