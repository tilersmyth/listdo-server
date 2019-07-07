import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class NewTaskDto {
  @Field(() => ID)
  readonly user: string;
  @Field(() => ID)
  readonly email: string;
  @Field(() => ID)
  readonly board: string;
  @Field(() => ID)
  readonly list: string;
  @Field()
  readonly role: string;
}
