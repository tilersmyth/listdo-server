import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class BoardDto {
  @Field()
  readonly name: string;
  @Field()
  readonly owner: string;
}
