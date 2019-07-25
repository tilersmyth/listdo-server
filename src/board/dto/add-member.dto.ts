import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class AddMemberDto {
  @Field()
  readonly success: boolean;
  @Field({ nullable: true })
  readonly error: string;
}
