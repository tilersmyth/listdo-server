import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class CreateListDto {
  @Field()
  readonly success: boolean;
  @Field({ nullable: true })
  readonly error: string;
}
