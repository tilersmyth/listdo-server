import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class AuthDto {
  @Field(() => Int)
  readonly expiresIn: number;
  @Field()
  readonly token: string;
  @Field()
  readonly userId: string;
}
