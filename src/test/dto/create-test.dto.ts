import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class CreateTestDto {
  @Field()
  readonly name: string;
  @Field(() => Int)
  readonly count: number;
}
